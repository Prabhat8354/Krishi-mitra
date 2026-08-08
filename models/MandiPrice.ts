import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMandiPrice extends Document {
  crop: string;
  hindiName: string;
  todayPrice: number;
  yesterdayPrice: number;
  weeklyHigh: number;
  weeklyLow: number;
  trend: "up" | "down" | "stable";
  changePercent: number;
  unit: string;
  mandiName: string;
  state: string;
  district: string;
  lastUpdated: string;
  last7Days: { day: string; price: number }[];
  createdAt: Date;
  updatedAt: Date;
}

const MandiPriceSchema = new Schema<IMandiPrice>(
  {
    crop: { type: String, required: true },
    hindiName: { type: String, required: true },
    todayPrice: { type: Number, required: true },
    yesterdayPrice: { type: Number, required: true },
    weeklyHigh: { type: Number, required: true },
    weeklyLow: { type: Number, required: true },
    trend: { type: String, enum: ["up", "down", "stable"], required: true },
    changePercent: { type: Number, required: true },
    unit: { type: String, default: "₹ / Quintal" },
    mandiName: { type: String, required: true },
    state: { type: String, required: true },
    district: { type: String, required: true },
    lastUpdated: { type: String, required: true },
    last7Days: [
      {
        day: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

// Compound index to quickly find and update crop rates in a specific market
MandiPriceSchema.index({ state: 1, district: 1, crop: 1, mandiName: 1 }, { unique: true });

export const MandiPriceModel: Model<IMandiPrice> =
  mongoose.models.MandiPrice || mongoose.model<IMandiPrice>("MandiPrice", MandiPriceSchema);
