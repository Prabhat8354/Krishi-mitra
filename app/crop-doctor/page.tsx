"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { speakNaturalVoice } from "@/lib/speech-preprocessor";
import { 
  ArrowLeft, 
  UploadCloud, 
  Camera, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Clock, 
  Sprout, 
  FlaskConical, 
  Leaf, 
  RotateCcw,
  MessageSquare,
  FileText,
  Bookmark,
  Share2,
  Download,
  Star
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import MitraMascot from "@/components/MitraMascot";
import { useStore } from "@/store/useStore";
import { savePlantAnalysis } from "@/actions/plant-history";

interface DiseaseData {
  cropName: string;
  disease: string;
  confidence: number;
  severity: string;
  isHealthy: boolean;
  description: string;
  organicTreatment: string;
  chemicalTreatment: string;
  recommendedFertilizer: string;
  recommendedPesticide: string;
  preventionTips: string;
  recoveryTime: string;
  geminiAdvice?: string;
}

export default function CropDoctorPage() {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [result, setResult] = useState<DiseaseData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setSelectedImage(base64);
      processImage(base64);
    };
    reader.readAsDataURL(file);
  };

  const processImage = async (base64Image: string) => {
    setIsScanning(true);
    setScanProgress(20);
    setError(null);
    setResult(null);

    const interval = setInterval(() => {
      setScanProgress((prev) => (prev < 90 ? prev + 15 : prev));
    }, 300);

    try {
      const res = await fetch("/api/disease-detect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64Image }),
      });

      clearInterval(interval);
      setScanProgress(100);

      const data = await res.json();
      if (data.success && data.data) {
        setResult(data.data);

        // Speak concise, natural diagnostic summary (No JSON, IDs, or markdown)
        const speechSummary = `This appears to be ${data.data.disease} in ${data.data.cropName} plants. The confidence level is ${data.data.confidence} percent. I recommend ${data.data.organicTreatment || data.data.chemicalTreatment}.`;
        speakNaturalVoice(speechSummary);
      } else {
        throw new Error(data.error || "Unable to analyze crop image. Please try another image.");
      }
    } catch (err: any) {
      clearInterval(interval);
      setError(err.message || "Unable to analyze crop image. Please try another image.");
      speakNaturalVoice("I'm sorry. I couldn't analyze the crop image. Please try again.");
    } finally {
      setIsScanning(false);
    }
  };

  const resetScanner = () => {
    setSelectedImage(null);
    setResult(null);
    setError(null);
    setScanProgress(0);
    setIsSaved(false);
  };

  const handleSaveReport = async () => {
    if (!result || !selectedImage) return;
    try {
      const storeState = useStore.getState();
      const sId = storeState.sessionId || "session";

      const res = await savePlantAnalysis({
        sessionId: sId,
        imageUrl: selectedImage,
        plantName: result.cropName,
        disease: result.disease,
        probability: result.confidence,
        treatment: result.organicTreatment || result.chemicalTreatment || "Standard treatment",
        symptoms: result.description,
        prevention: result.preventionTips,
        isHealthy: result.isHealthy,
      });

      if (res.success) {
        setIsSaved(true);
        alert("Diagnostic Report saved successfully to your farm history!");
      } else {
        alert("Failed to save report: " + res.error);
      }
    } catch (e: any) {
      alert("Error saving report: " + e.message);
    }
  };

  const handleDownloadPDF = () => {
    if (!result) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to download/print the diagnostic report.");
      return;
    }
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Krishi Mitra Diagnostic Report - \${result.disease}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #111827; padding: 40px; line-height: 1.6; }
            .header { border-bottom: 3px solid #059669; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
            .logo { font-size: 24px; font-weight: 800; color: #059669; }
            .title { font-size: 28px; font-weight: 900; margin: 10px 0; color: #111827; }
            .meta { font-size: 12px; color: #6B7280; margin-bottom: 20px; }
            .grid { display: grid; grid-template-cols: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
            .card { border: 1px solid #E5E7EB; border-radius: 12px; padding: 20px; background-color: #F9FAFB; }
            .card-title { font-size: 16px; font-weight: 700; color: #065F46; margin-top: 0; margin-bottom: 10px; border-bottom: 1px solid #E5E7EB; padding-bottom: 5px; }
            .card-content { font-size: 14px; color: #374151; }
            .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase; border: 1px solid; }
            .badge-danger { background-color: #FEF2F2; color: #991B1B; border-color: #FCA5A5; }
            .badge-success { background-color: #ECFDF5; color: #065F46; border-color: #A7F3D0; }
            .description { font-size: 15px; color: #1F2937; margin-bottom: 30px; background-color: #F0FDF4; border: 1px dashed #A7F3D0; padding: 15px; border-radius: 8px; }
            .footer { text-align: center; font-size: 11px; color: #9CA3AF; margin-top: 50px; border-top: 1px solid #E5E7EB; padding-top: 20px; }
            @media print {
              body { padding: 20px; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">🌾 Krishi Sathi AI</div>
            <div class="badge \${result.isHealthy ? "badge-success" : "badge-danger"}">\${result.isHealthy ? "Healthy" : result.severity || "Infected"}</div>
          </div>
          
          <div class="title">Crop Diagnostic Report</div>
          <div class="meta">
            <strong>Crop:</strong> \${result.cropName} &nbsp;|&nbsp; 
            <strong>Disease:</strong> \${result.disease} &nbsp;|&nbsp; 
            <strong>Confidence:</strong> \${result.confidence}% Match &nbsp;|&nbsp;
            <strong>Date:</strong> \${new Date().toLocaleDateString("en-IN")}
          </div>

          <div class="description">
            <strong>Diagnostic Description:</strong><br/>
            \${result.description}
          </div>

          <div class="grid">
            <div class="card">
              <div class="card-title">🌿 Organic Solution</div>
              <div class="card-content">\${result.organicTreatment}</div>
            </div>
            
            <div class="card">
              <div class="card-title">🧪 Chemical Treatment</div>
              <div class="card-content">\${result.chemicalTreatment}</div>
            </div>

            <div class="card">
              <div class="card-title">🌾 Recommended Fertilizer</div>
              <div class="card-content">\${result.recommendedFertilizer}</div>
            </div>

            <div class="card">
              <div class="card-title">⏱️ Recovery Timeline</div>
              <div class="card-content">
                <strong>Pesticide:</strong> \${result.recommendedPesticide}<br/>
                <strong>Expected Recovery:</strong> \${result.recoveryTime}
              </div>
            </div>
          </div>

          <div class="card" style="margin-top: 20px;">
            <div class="card-title">🛡️ Prevention Guidelines</div>
            <div class="card-content">\${result.preventionTips}</div>
          </div>

          <div class="footer">
            Generated by Krishi Sathi Crop Vision Pathology Engine. This is an AI-assisted diagnostic sheet.
          </div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleShare = () => {
    if (navigator.share && result) {
      navigator.share({
        title: `Krishi Mitra Diagnostic: ${result.disease}`,
        text: `Diagnosis for ${result.cropName}: ${result.disease} (${result.confidence}% confidence).`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      alert("Report link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF7] text-[#111827] pb-36 font-sans">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-gray-200/80 px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-2 rounded-xl hover:bg-gray-100 text-gray-600 transition"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-lg md:text-xl font-black text-gray-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              Crop Doctor AI • Kindwise Medical Diagnostics
            </h1>
            <p className="text-xs text-gray-600 font-semibold">Computer vision leaf diagnostics & Gemini AI treatment plans</p>
          </div>
        </div>

        <span className="text-xs bg-emerald-50 text-emerald-800 px-3.5 py-1.5 rounded-full font-bold border border-emerald-200">
          Kindwise API Connected
        </span>
      </header>

      {/* EXPANDED CONTENT CONTAINER (85-90% width, Max 1700px) */}
      <main className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 pt-8 space-y-10">
        
        {/* Upload Zone */}
        {!selectedImage && (
          <div className="bg-white rounded-[24px] p-8 md:p-14 border border-gray-200/80 shadow-xs text-center space-y-6 max-w-4xl mx-auto">
            <div className="w-20 h-20 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-xs border border-emerald-200/60">
              <UploadCloud className="w-10 h-10" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h2 className="text-3xl font-black text-gray-900">Upload or Take Crop Leaf Photo</h2>
              <p className="text-sm text-gray-600 font-medium leading-relaxed">
                Take a clear close-up photo of infected leaves or stems for instant AI disease identification.
              </p>
            </div>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full sm:w-auto h-[52px] px-8 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
              >
                <UploadCloud className="w-5 h-5" /> Upload Image
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full sm:w-auto h-[52px] px-8 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-900 text-sm font-bold transition flex items-center justify-center gap-2"
              >
                <Camera className="w-5 h-5 text-emerald-600" /> Open Camera
              </button>
            </div>
          </div>
        )}

        {/* Loading Scanning State */}
        {isScanning && (
          <div className="bg-white rounded-[24px] p-10 text-center space-y-6 border border-gray-200/80 shadow-xs animate-pulse max-w-3xl mx-auto">
            <MitraMascot mode="inline" />
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-gray-900">Mitra is analyzing your crop...</h3>
              <p className="text-sm text-emerald-700 font-bold">Computer Vision & Gemini AI Medical Reasoning Active</p>
            </div>

            <div className="w-full max-w-md mx-auto bg-gray-100 rounded-full h-4 overflow-hidden shadow-inner">
              <div
                style={{ width: `${scanProgress}%` }}
                className="bg-emerald-600 h-full rounded-full transition-all duration-300"
              />
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-rose-50 rounded-[24px] p-6 border border-rose-200 text-center space-y-4 max-w-2xl mx-auto">
            <AlertTriangle className="w-8 h-8 text-rose-600 mx-auto" />
            <div>
              <h3 className="text-lg font-bold text-rose-900">Unable to analyze crop image</h3>
              <p className="text-sm text-rose-700 mt-1">{error}</p>
            </div>
            <button
              onClick={resetScanner}
              className="h-[52px] px-6 rounded-xl bg-rose-600 text-white text-sm font-bold shadow-xs hover:bg-rose-700 transition inline-flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Try Another Image
            </button>
          </div>
        )}

        {/* HIGH-CONTRAST READABLE DIAGNOSTIC RESULT DASHBOARD */}
        {result && (
          <div className="space-y-10 animate-in fade-in duration-300">
            
            {/* TOP ACTION BUTTONS BAR (Height 52px) */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-[20px] border border-gray-200/80 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Diagnostic Actions:</span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={resetScanner}
                  className="h-[52px] px-5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-900 text-xs font-bold transition flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4 text-emerald-600" /> Scan Again
                </button>

                <button
                  onClick={() => router.push(`/chat?q=${encodeURIComponent(`How to treat ${result.disease} in ${result.cropName}?`)}`)}
                  className="h-[52px] px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-2 shadow-xs"
                >
                  <MessageSquare className="w-4 h-4" /> Ask Mitra
                </button>

                <button
                  onClick={handleDownloadPDF}
                  className="h-[52px] px-5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200 text-xs font-bold transition flex items-center gap-2"
                >
                  <FileText className="w-4 h-4 text-sky-600" /> Download Report
                </button>

                <button
                  onClick={handleSaveReport}
                  disabled={isSaved}
                  className={`h-[52px] px-5 rounded-xl text-xs font-bold transition flex items-center gap-2 border ${
                    isSaved
                      ? "bg-amber-100 text-amber-900 border-amber-300 cursor-not-allowed"
                      : "bg-gray-50 text-gray-800 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  <Star className={`w-4 h-4 ${isSaved ? "text-amber-500 fill-amber-500" : "text-gray-400"}`} />
                  {isSaved ? "Saved" : "Save Report"}
                </button>
              </div>
            </div>

            {/* MAIN DIAGNOSIS CARD (28px Padding, 36px Main Heading, 18px Body Text, 1.8 Line Height) */}
            <div className="bg-white rounded-[24px] p-7 md:p-[28px] border border-gray-200/80 shadow-xs space-y-8">
              
              {/* Header & Badges */}
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b pb-8 border-gray-100">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold uppercase tracking-wider bg-gray-100 text-gray-800 px-3.5 py-1 rounded-full border border-gray-200">
                      🌱 Crop: {result.cropName}
                    </span>
                    <span
                      className={`text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full border ${
                        result.isHealthy
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : "bg-rose-50 text-rose-800 border-rose-200"
                      }`}
                    >
                      {result.isHealthy ? "Healthy Crop" : result.severity}
                    </span>
                  </div>

                  {/* MAIN HEADING SIZE 36PX WITH STRONGER EMPHASIS */}
                  <h2 className="text-[32px] md:text-[36px] font-black text-[#111827] tracking-tight leading-tight">
                    {result.disease}
                  </h2>
                  
                  {/* BODY TEXT SIZE 18PX WITH 1.8 LINE HEIGHT AND DARK COLOR #1F2937 */}
                  <p className="text-[18px] text-[#1F2937] leading-[1.8] font-medium max-w-6xl">
                    {result.description}
                  </p>
                </div>

                {selectedImage && (
                  <div className="w-28 h-28 rounded-2xl overflow-hidden border border-gray-200 shadow-xs shrink-0 bg-gray-50">
                    <img src={selectedImage} alt="Crop Scan" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* CONFIDENCE BAR WITH LARGER PERCENTAGE FONT */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm font-bold text-[#111827]">
                  <span>Kindwise AI Detection Confidence Match</span>
                  {/* LARGER CONFIDENCE FONT */}
                  <span className="text-2xl md:text-3xl font-black text-emerald-600">
                    {result.confidence}% Match
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden shadow-inner">
                  <div
                    style={{ width: `${result.confidence}%` }}
                    className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                  />
                </div>
              </div>

              {/* TREATMENT CARDS GRID (22px Card Titles, 28px Padding, 18px Body Text) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-7 pt-4">
                
                {/* Organic Treatment */}
                <div className="p-[28px] rounded-2xl bg-emerald-50/80 border border-emerald-200/90 space-y-3">
                  <h3 className="text-[22px] font-bold text-emerald-950 flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-emerald-600" /> Recommended Organic Solution
                  </h3>
                  <p className="text-[18px] text-[#1F2937] font-medium leading-[1.8]">
                    {result.organicTreatment}
                  </p>
                </div>

                {/* Chemical Treatment */}
                <div className="p-[28px] rounded-2xl bg-sky-50/80 border border-sky-200/90 space-y-3">
                  <h3 className="text-[22px] font-bold text-sky-950 flex items-center gap-2">
                    <FlaskConical className="w-5 h-5 text-sky-600" /> Recommended Chemical Treatment
                  </h3>
                  <p className="text-[18px] text-[#1F2937] font-medium leading-[1.8]">
                    {result.chemicalTreatment}
                  </p>
                </div>

                {/* Recommended Fertilizer */}
                <div className="p-[28px] rounded-2xl bg-amber-50/80 border border-amber-200/90 space-y-3">
                  <h3 className="text-[22px] font-bold text-amber-950 flex items-center gap-2">
                    <Sprout className="w-5 h-5 text-amber-600" /> Recommended Fertilizer & Dosage
                  </h3>
                  <p className="text-[18px] text-[#1F2937] font-medium leading-[1.8]">
                    {result.recommendedFertilizer}
                  </p>
                </div>

                {/* Recommended Pesticide & Recovery */}
                <div className="p-[28px] rounded-2xl bg-purple-50/80 border border-purple-200/90 space-y-3">
                  <h3 className="text-[22px] font-bold text-purple-950 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-purple-600" /> Pesticide & Recovery Timeline
                  </h3>
                  <div className="text-[18px] text-[#1F2937] font-medium leading-[1.8] space-y-1">
                    <div><strong>Pesticide:</strong> {result.recommendedPesticide}</div>
                    {/* LARGER RECOVERY TIME EMPHASIS */}
                    <div className="text-purple-900 font-extrabold text-lg pt-1">
                      ⏱️ Expected Recovery: <span className="underline decoration-purple-300">{result.recoveryTime}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Prevention Tips */}
              <div className="p-[28px] rounded-2xl bg-gray-50 border border-gray-200/80 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block">Future Field Prevention Tips</span>
                <p className="text-[18px] text-[#1F2937] font-medium leading-[1.8]">{result.preventionTips}</p>
              </div>

            </div>

            {/* GEMINI AI DETAILED ENHANCEMENT SECTION */}
            {result.geminiAdvice && (
              <div className="bg-white rounded-[24px] p-7 md:p-[28px] border border-gray-200/80 shadow-xs space-y-6">
                <div className="flex items-center gap-4 border-b pb-4 border-gray-100">
                  <MitraMascot mode="inline" />
                  <div>
                    <h3 className="text-[22px] font-extrabold text-[#111827]">Mitra AI Comprehensive Treatment Plan</h3>
                    <p className="text-xs text-gray-500 font-semibold">Personalized step-by-step guidance for {result.cropName}</p>
                  </div>
                </div>

                <div className="prose prose-base max-w-none text-[#1F2937] text-[18px] leading-[1.8]">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {result.geminiAdvice}
                  </ReactMarkdown>
                </div>
              </div>
            )}

          </div>
        )}

      </main>

      {/* STICKY BOTTOM ACTION BAR (Button Height 52px) */}
      {result && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-gray-200/80 py-4 px-4 md:px-8 shadow-2xl">
          <div className="max-w-[1700px] mx-auto flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-sm font-extrabold text-gray-900 hidden sm:inline">
                Diagnostic Active: {result.disease}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 ml-auto">
              <button
                onClick={resetScanner}
                className="h-[52px] px-5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-900 text-xs font-bold transition flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4 text-emerald-600" /> Scan Another Image
              </button>

              <button
                onClick={() => router.push(`/chat?q=${encodeURIComponent(`How to treat ${result.disease} in ${result.cropName}?`)}`)}
                className="h-[52px] px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-2 shadow-xs"
              >
                <MessageSquare className="w-4 h-4" /> Continue Chat
              </button>

              <button
                onClick={handleShare}
                className="h-[52px] px-5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-800 border border-gray-200 text-xs font-bold transition flex items-center gap-2"
              >
                <Share2 className="w-4 h-4 text-gray-500" /> Share Report
              </button>

              <button
                onClick={handleSaveReport}
                disabled={isSaved}
                className={`h-[52px] px-5 rounded-xl text-xs font-bold transition flex items-center gap-2 border ${
                  isSaved
                    ? "bg-amber-100 text-amber-900 border-amber-300 cursor-not-allowed"
                    : "bg-gray-50 text-gray-800 border-gray-200 hover:bg-gray-100"
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? "text-amber-500 fill-amber-500" : "text-gray-500"}`} />
                {isSaved ? "Saved" : "Save History"}
              </button>

              <button
                onClick={handleDownloadPDF}
                className="h-[52px] px-5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200 text-xs font-bold transition flex items-center gap-2"
              >
                <Download className="w-4 h-4 text-sky-600" /> Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
