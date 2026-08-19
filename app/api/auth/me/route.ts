import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db";
import { UserModel } from "@/models/User";
import { verifyJWT } from "@/lib/jwt";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("krishi_token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, authenticated: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const payload = verifyJWT(token);
    if (!payload || !payload.userId) {
      return NextResponse.json(
        { success: false, authenticated: false, error: "Invalid or expired session token" },
        { status: 401 }
      );
    }

    let userObj;
    if (payload.userId === "guest_farmer") {
      userObj = {
        _id: "guest_farmer",
        name: "Guest Farmer",
        email: "guest@krishimitra.com",
        phone: "0000000000",
        role: "Farmer",
        state: payload.state || "Punjab",
        district: payload.district || "Ludhiana",
        village: payload.village || "Samrala",
        farmSize: 5,
        farmSizeUnit: "Acres",
        primaryCrop: "Wheat, Rice, Tomato",
        preferredLanguage: "hi-IN",
        voiceLanguage: "hi-IN",
      };
    } else {
      await connectDB();
      const user = await UserModel.findById(payload.userId).select("-password");

      if (!user) {
        return NextResponse.json(
          { success: false, authenticated: false, error: "User account not found" },
          { status: 404 }
        );
      }
      userObj = user.toObject();
    }

    return NextResponse.json({
      success: true,
      authenticated: true,
      user: userObj,
    });
  } catch (error: any) {
    console.error("❌ Auth Me API Error:", error);
    return NextResponse.json(
      { success: false, authenticated: false, error: error.message },
      { status: 500 }
    );
  }
}
