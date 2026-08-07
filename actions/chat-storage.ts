"use server";

import { connectDB } from "@/lib/db";
import { ChatHistoryModel } from "@/models/ChatHistory";

export interface StoredMessage {
  id: string;
  sessionId: string;
  role: "user" | "assistant";
  content: string;
  imageUrl?: string;
  thinkingText?: string;
  audioBase64?: string;
  timestamp: Date;
}

export async function getSessionMessages(sessionId: string): Promise<StoredMessage[]> {
  try {
    await connectDB();
    const result = await ChatHistoryModel.find({ sessionId }).sort({ createdAt: 1 });
    return result.map((item: any) => ({
      id: item._id.toString(),
      sessionId: item.sessionId,
      role: item.role,
      content: item.content,
      imageUrl: item.imageUrl,
      thinkingText: item.thinkingText,
      timestamp: item.createdAt,
    }));
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    return [];
  }
}

export async function loadSessionMessages(sessionId: string): Promise<{ success: boolean; messages: StoredMessage[] }> {
  const messages = await getSessionMessages(sessionId);
  return { success: true, messages };
}

export async function saveMessage(params: {
  userId?: string;
  sessionId: string;
  role: "user" | "assistant";
  content: string;
  imageUrl?: string;
  thinkingText?: string;
}) {
  try {
    await connectDB();
    const newMsg = await ChatHistoryModel.create({
      userId: params.userId || "000000000000000000000000",
      sessionId: params.sessionId,
      role: params.role,
      content: params.content,
      imageUrl: params.imageUrl,
      thinkingText: params.thinkingText,
    });
    return { success: true, id: newMsg._id.toString() };
  } catch (error) {
    console.error("Failed to save message:", error);
    return { success: false, error: "Failed to save message" };
  }
}

export async function clearSessionMessages(sessionId: string) {
  try {
    await connectDB();
    await ChatHistoryModel.deleteMany({ sessionId });
    return { success: true };
  } catch (error) {
    console.error("Failed to clear messages:", error);
    return { success: false, error: "Failed to clear messages" };
  }
}
