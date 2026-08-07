"use server";

import { connectDB } from "@/lib/db";
import { DiseaseDetectionModel } from "@/models/DiseaseDetection";
import { ChatHistoryModel } from "@/models/ChatHistory";
import { getWeather } from "./weather";
import { getSarvamChatCompletion } from "./sarvam-chat";

interface CropHealthPrediction {
  riskLevel: "low" | "medium" | "high";
  riskScore: number;
  predictions: string[];
  recommendations: string[];
  weatherAlert?: string;
}

interface FarmInsightsData {
  totalScans: number;
  healthyPlants: number;
  diseasedPlants: number;
  commonDiseases: { name: string; count: number }[];
  recentScans: {
    id: string;
    plantName: string;
    disease: string;
    isHealthy: boolean;
    timestamp: Date;
  }[];
  chatTopics: { topic: string; count: number }[];
  healthTrend: "improving" | "declining" | "stable";
}

interface CropCalendarItem {
  month: string;
  activities: {
    type: "sowing" | "harvesting" | "fertilizing" | "watering" | "pest-control";
    crop: string;
    description: string;
    timing: string;
  }[];
  weatherTip?: string;
}

const DISEASE_RISK_FACTORS = {
  highHumidity: {
    threshold: 80,
    diseases: ["fungal infections", "leaf blight", "powdery mildew", "rust"],
    multiplier: 1.5,
  },
  highTemperature: {
    threshold: 35,
    diseases: ["heat stress", "wilting", "sunscald"],
    multiplier: 1.3,
  },
  lowTemperature: {
    threshold: 10,
    diseases: ["frost damage", "cold stress", "slow growth"],
    multiplier: 1.2,
  },
  highMoisture: {
    threshold: 70,
    diseases: ["root rot", "damping off", "bacterial infections"],
    multiplier: 1.4,
  },
};

const SEASONAL_CROPS = {
  kharif: {
    months: [6, 7, 8, 9, 10],
    crops: ["Rice", "Cotton", "Maize", "Soybean", "Groundnut", "Jowar", "Bajra", "Sugarcane"],
  },
  rabi: {
    months: [10, 11, 12, 1, 2, 3],
    crops: ["Wheat", "Barley", "Mustard", "Chickpea", "Peas", "Lentils", "Potato"],
  },
  zaid: {
    months: [3, 4, 5, 6],
    crops: ["Watermelon", "Muskmelon", "Cucumber", "Vegetables", "Moong", "Fodder"],
  },
};

export async function getCropHealthPrediction(
  sessionId: string,
  lat: string | null,
  lon: string | null,
  language: string
): Promise<CropHealthPrediction> {
  try {
    await connectDB();
    const recentScans = await DiseaseDetectionModel.find().sort({ createdAt: -1 }).limit(10);

    let weatherData = null;
    if (lat && lon) {
      const weatherResult = await getWeather(lat, lon, language.split("-")[0]);
      if (weatherResult.success) {
        weatherData = weatherResult.data;
      }
    }

    const diseasedCount = recentScans.filter((s: any) => !s.disease.toLowerCase().includes("healthy")).length;
    const baseRisk = recentScans.length > 0 ? (diseasedCount / recentScans.length) * 100 : 0;

    let weatherRisk = 0;
    let weatherAlert = undefined;
    const predictions: string[] = [];
    const recommendations: string[] = [];

    if (weatherData) {
      if (weatherData.humidity >= DISEASE_RISK_FACTORS.highHumidity.threshold) {
        weatherRisk += 25;
        predictions.push(...DISEASE_RISK_FACTORS.highHumidity.diseases.slice(0, 2));
        recommendations.push("Apply preventive fungicide spray");
        recommendations.push("Ensure proper plant spacing for air circulation");
        weatherAlert = `High humidity (${weatherData.humidity}%) increases fungal disease risk`;
      }

      if (weatherData.temperature >= DISEASE_RISK_FACTORS.highTemperature.threshold) {
        weatherRisk += 20;
        predictions.push(...DISEASE_RISK_FACTORS.highTemperature.diseases.slice(0, 2));
        recommendations.push("Provide shade for sensitive crops");
        recommendations.push("Increase irrigation frequency");
        weatherAlert = weatherAlert
          ? `${weatherAlert}. High temperature may cause heat stress.`
          : `High temperature (${weatherData.temperature}°C) may cause heat stress`;
      }
    }

    const totalRisk = Math.min(100, baseRisk * 0.6 + weatherRisk);

    let riskLevel: "low" | "medium" | "high" = "low";
    if (totalRisk >= 60) riskLevel = "high";
    else if (totalRisk >= 30) riskLevel = "medium";

    if (recommendations.length === 0) {
      recommendations.push("Continue regular crop monitoring");
      recommendations.push("Maintain proper irrigation schedule");
    }

    if (predictions.length === 0) {
      predictions.push("No immediate disease threats detected");
    }

    return {
      riskLevel,
      riskScore: Math.round(totalRisk),
      predictions: [...new Set(predictions)].slice(0, 5),
      recommendations: [...new Set(recommendations)].slice(0, 5),
      weatherAlert,
    };
  } catch (error) {
    console.error("Error getting crop health prediction:", error);
    return {
      riskLevel: "low",
      riskScore: 0,
      predictions: ["Unable to generate predictions"],
      recommendations: ["Please try again later"],
    };
  }
}

export async function getFarmInsights(sessionId: string): Promise<FarmInsightsData> {
  try {
    await connectDB();
    const allScans = await DiseaseDetectionModel.find().sort({ createdAt: -1 });

    const totalScans = allScans.length;
    const healthyPlants = allScans.filter((s: any) => s.disease.toLowerCase().includes("healthy")).length;
    const diseasedPlants = totalScans - healthyPlants;

    const diseaseMap = new Map<string, number>();
    allScans
      .filter((s: any) => !s.disease.toLowerCase().includes("healthy"))
      .forEach((s: any) => {
        const count = diseaseMap.get(s.disease) || 0;
        diseaseMap.set(s.disease, count + 1);
      });

    const commonDiseases = Array.from(diseaseMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const recentScans = allScans.slice(0, 5).map((s: any) => ({
      id: s._id.toString(),
      plantName: "Crop Specimen",
      disease: s.disease,
      isHealthy: s.disease.toLowerCase().includes("healthy"),
      timestamp: s.createdAt,
    }));

    const chatMessages = await ChatHistoryModel.find({ role: "user" }).sort({ createdAt: -1 }).limit(50);

    const topicKeywords = {
      "Pest Control": ["pest", "insect", "bug", "कीट", "कीड़े"],
      "Disease": ["disease", "infection", "बीमारी", "रोग"],
      "Irrigation": ["water", "irrigation", "पानी", "सिंचाई"],
      "Fertilizer": ["fertilizer", "nutrient", "खाद", "उर्वरक"],
      "Weather": ["weather", "rain", "मौसम", "बारिश"],
      "Crop Care": ["grow", "plant", "crop", "फसल", "उगाना"],
    };

    const topicCounts = new Map<string, number>();
    chatMessages.forEach((msg: any) => {
      const content = msg.content.toLowerCase();
      for (const [topic, keywords] of Object.entries(topicKeywords)) {
        if (keywords.some((k) => content.includes(k))) {
          topicCounts.set(topic, (topicCounts.get(topic) || 0) + 1);
        }
      }
    });

    const chatTopics = Array.from(topicCounts.entries())
      .map(([topic, count]) => ({ topic, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalScans,
      healthyPlants,
      diseasedPlants,
      commonDiseases,
      recentScans,
      chatTopics,
      healthTrend: "stable",
    };
  } catch (error) {
    console.error("Error getting farm insights:", error);
    return {
      totalScans: 0,
      healthyPlants: 0,
      diseasedPlants: 0,
      commonDiseases: [],
      recentScans: [],
      chatTopics: [],
      healthTrend: "stable",
    };
  }
}

export async function getCropCalendar(
  lat: string | null,
  lon: string | null,
  language: string
): Promise<CropCalendarItem[]> {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;

  const calendar: CropCalendarItem[] = [];
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  for (let i = 0; i < 3; i++) {
    const monthIndex = (currentMonth - 1 + i) % 12;
    const month = months[monthIndex];
    const actualMonth = monthIndex + 1;

    const activities: CropCalendarItem["activities"] = [];

    if (SEASONAL_CROPS.kharif.months.includes(actualMonth)) {
      if (actualMonth >= 6 && actualMonth <= 7) {
        activities.push({
          type: "sowing",
          crop: "Rice, Cotton, Maize",
          description: "Begin sowing kharif crops after first monsoon rains",
          timing: "Early morning",
        });
      }
    }

    if (activities.length === 0) {
      activities.push({
        type: "fertilizing",
        crop: "General",
        description: "Prepare soil and add organic matter",
        timing: "Before next planting season",
      });
    }

    calendar.push({
      month,
      activities,
    });
  }

  return calendar;
}

export async function getGovernmentSchemes(
  language: string,
  userContext?: string
): Promise<{
  schemes: {
    name: string;
    description: string;
    eligibility: string;
    benefits: string;
    link?: string;
  }[];
}> {
  return {
    schemes: [
      {
        name: "PM-KISAN",
        description: "Direct income support of ₹6,000 per year to farmer families",
        eligibility: "All landholding farmer families",
        benefits: "₹6,000 per year in 3 installments",
        link: "https://pmkisan.gov.in",
      },
      {
        name: "PM Fasal Bima Yojana",
        description: "Comprehensive crop insurance scheme",
        eligibility: "All farmers growing notified crops",
        benefits: "Coverage against crop loss due to natural calamities",
        link: "https://pmfby.gov.in",
      },
      {
        name: "Kisan Credit Card (KCC)",
        description: "Easy credit access for farmers at subsidized interest rates",
        eligibility: "All farmers, fishermen, animal husbandry farmers",
        benefits: "Credit up to ₹3 lakh at 4% interest rate",
        link: "https://www.pmkisan.gov.in/kcc",
      },
    ],
  };
}

export async function getAICropAdvice(
  context: any,
  language: string
): Promise<string> {
  return "Monitor soil moisture & apply balanced NPK 19-19-19 foliar spray post-rain.";
}
