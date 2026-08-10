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

    if (updates.email !== undefined) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(updates.email.trim())) {
        return NextResponse.json(
          { success: false, error: "Please enter a valid email address." },
          { status: 400 }
        );
      }
      updates.email = updates.email.toLowerCase().trim();

      const emailExists = await UserModel.findOne({
        email: updates.email,
        _id: { $ne: payload.userId }
      });
      if (emailExists) {
        return NextResponse.json(
          { success: false, error: "An account with this email address already exists." },
          { status: 400 }
        );
      }
    }

    if (updates.phone !== undefined) {
      const phoneRegex = /^(?:\+91|91|0)?[6-9]\d{9}$/;
      if (!phoneRegex.test(updates.phone.trim())) {
        return NextResponse.json(
          { success: false, error: "Please enter a valid 10-digit Indian phone number." },
          { status: 400 }
        );
      }
      updates.phone = updates.phone.trim();

      const phoneExists = await UserModel.findOne({
        phone: updates.phone,
        _id: { $ne: payload.userId }
      });
      if (phoneExists) {
        return NextResponse.json(
          { success: false, error: "An account with this phone number already exists." },
          { status: 400 }
        );
      }
    }

    if (updates.farmSize !== undefined && (isNaN(Number(updates.farmSize)) || Number(updates.farmSize) <= 0)) {
      return NextResponse.json(
        { success: false, error: "Farm area must be a positive number." },
        { status: 400 }
      );
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
