"use server";

import { connectDB } from "@/lib/db";
import { DiseaseDetectionModel } from "@/models/DiseaseDetection";

interface PlantHistoryItem {
  id: string;
  imageUrl: string;
  plantName?: string;
  plantDescription?: string;
  plantProbability?: number;
  disease: string;
  probability: number;
  symptoms?: string;
  treatment?: string;
  prevention?: string;
  isHealthy: boolean;
  timestamp: Date;
}

interface SavePlantAnalysisData {
  sessionId: string;
  userId?: string;
  imageUrl: string;
  plantName?: string;
  plantDescription?: string;
  plantProbability?: number;
  disease: string;
  probability: number;
  symptoms?: string;
  treatment?: string;
  prevention?: string;
  isHealthy: boolean;
}

export async function savePlantAnalysis(
  data: SavePlantAnalysisData
): Promise<{ success: boolean; error?: string }> {
  try {
    await connectDB();
    await DiseaseDetectionModel.create({
      userId: data.userId || "000000000000000000000000",
      imageUrl: data.imageUrl,
      disease: data.disease,
      confidence: data.probability,
      treatment: data.treatment || "Standard crop protection",
      symptoms: data.symptoms,
      prevention: data.prevention,
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to save plant analysis:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save analysis",
    };
  }
}

export async function getPlantAnalysisHistory(
  sessionId: string
): Promise<PlantHistoryItem[]> {
  try {
    await connectDB();
    const history = await DiseaseDetectionModel.find().sort({ createdAt: -1 }).limit(20);

    return history.map((item: any) => ({
      id: item._id.toString(),
      imageUrl: item.imageUrl,
      plantName: "Crop Specimen",
      disease: item.disease,
      probability: item.confidence,
      symptoms: item.symptoms,
      treatment: item.treatment,
      prevention: item.prevention,
      isHealthy: item.disease.toLowerCase().includes("healthy"),
      timestamp: item.createdAt,
    }));
  } catch (error) {
    console.error("Failed to fetch plant analysis history:", error);
    return [];
  }
}

export async function deletePlantAnalysisHistory(
  sessionId: string
): Promise<{ success: boolean }> {
  try {
    await connectDB();
    await DiseaseDetectionModel.deleteMany({});
    return { success: true };
  } catch (error) {
    console.error("Failed to delete plant analysis history:", error);
    return { success: false };
  }
}

export async function deleteSinglePlantAnalysis(
  id: string
): Promise<{ success: boolean }> {
  try {
    await connectDB();
    await DiseaseDetectionModel.findByIdAndDelete(id);
    return { success: true };
  } catch (error) {
    console.error("Failed to delete plant analysis:", error);
    return { success: false };
  }
}
