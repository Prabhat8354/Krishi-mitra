import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  password: string;
  gender?: string;
  dob?: string;
  state?: string;
  district?: string;
  village?: string;
  address?: string;
  pincode?: string;
  gpsLocation?: { lat: number; lon: number };
  farmSize?: number;
  farmSizeUnit?: string;
  primaryCrop?: string;
  soilType?: string;
  irrigationSource?: string;
  experience?: string;
  preferredLanguage?: string;
  voiceLanguage?: string;
  profilePhoto?: string;
  role: "Farmer" | "Admin";
  notificationPreferences?: Record<string, boolean>;
  weatherLocation?: Record<string, any>;
  createdAt: Date;
  lastLogin: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    gender: { type: String, default: "Male" },
    dob: { type: String, default: "" },
    state: { type: String, default: "Punjab" },
    district: { type: String, default: "Ludhiana" },
    village: { type: String, default: "Samrala" },
    address: { type: String, default: "" },
    pincode: { type: String, default: "" },
    gpsLocation: {
      lat: { type: Number, default: 30.9010 },
      lon: { type: Number, default: 75.8573 },
    },
    farmSize: { type: Number, default: 5 },
    farmSizeUnit: { type: String, default: "Acres" },
    primaryCrop: { type: String, default: "Wheat, Rice, Tomato" },
    soilType: { type: String, default: "Alluvial / Loamy" },
    irrigationSource: { type: String, default: "Canal / Borewell" },
    experience: { type: String, default: "5+ Years" },
    preferredLanguage: { type: String, default: "hi-IN" },
    voiceLanguage: { type: String, default: "hi-IN" },
    profilePhoto: { type: String, default: "" },
    role: { type: String, enum: ["Farmer", "Admin"], default: "Farmer" },
    notificationPreferences: { type: Object, default: { email: true, sms: true, push: true } },
    weatherLocation: { type: Object, default: {} },
    lastLogin: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const UserModel: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
