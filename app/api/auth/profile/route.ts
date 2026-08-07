import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db";
import { UserModel } from "@/models/User";
import { verifyJWT } from "@/lib/jwt";

export async function PUT(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("krishi_token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const payload = verifyJWT(token);
    if (!payload || !payload.userId) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired session token" },
        { status: 401 }
      );
    }

    await connectDB();
    const body = await req.json();

    const allowedUpdates = [
      "name",
      "phone",
      "email",
      "state",
      "district",
      "village",
      "gpsLocation",
      "farmSize",
      "farmSizeUnit",
      "primaryCrop",
      "preferredLanguage",
      "voiceLanguage",
      "profilePhoto",
      "notificationPreferences",
    ];

    const updates: Record<string, any> = {};
    for (const key of allowedUpdates) {
      if (body[key] !== undefined) {
        updates[key] = body[key];
      }
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      payload.userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully!",
      user: updatedUser.toObject(),
    });
  } catch (error: any) {
    console.error("❌ Profile Update API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update profile." },
      { status: 500 }
    );
  }
}
