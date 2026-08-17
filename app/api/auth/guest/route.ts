import { NextResponse } from "next/server";
import { signJWT } from "@/lib/jwt";

export async function POST() {
  try {
    const token = signJWT({
      userId: "guest_farmer",
      email: "guest@krishimitra.com",
      phone: "0000000000",
      role: "Farmer",
    });

    const response = NextResponse.json({
      success: true,
      message: "Guest login successful!",
    });

    response.cookies.set("krishi_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("❌ Guest Login API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error during guest login." },
      { status: 500 }
    );
  }
}
