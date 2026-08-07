import mongoose, { Schema, Document, Model } from "mongoose";

export interface IChatHistory extends Document {
  userId: mongoose.Types.ObjectId;
  sessionId: string;
  role: "user" | "assistant";
  content: string;
  imageUrl?: string;
  thinkingText?: string;
  createdAt: Date;
}

const ChatHistorySchema = new Schema<IChatHistory>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    sessionId: { type: String, required: true },
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true },
    imageUrl: { type: String },
    thinkingText: { type: String },
  },
  { timestamps: true }
);

export const ChatHistoryModel: Model<IChatHistory> =
  mongoose.models.ChatHistory || mongoose.model<IChatHistory>("ChatHistory", ChatHistorySchema);
