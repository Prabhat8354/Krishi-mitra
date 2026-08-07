import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDiseaseDetection extends Document {
  userId: mongoose.Types.ObjectId;
  imageUrl: string;
  disease: string;
  confidence: number;
  treatment: string;
  symptoms?: string;
  prevention?: string;
  createdAt: Date;
}

const DiseaseDetectionSchema = new Schema<IDiseaseDetection>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    imageUrl: { type: String, required: true },
    disease: { type: String, required: true },
    confidence: { type: Number, required: true },
    treatment: { type: String, required: true },
    symptoms: { type: String },
    prevention: { type: String },
  },
  { timestamps: true }
);

export const DiseaseDetectionModel: Model<IDiseaseDetection> =
  mongoose.models.DiseaseDetection || mongoose.model<IDiseaseDetection>("DiseaseDetection", DiseaseDetectionSchema);
