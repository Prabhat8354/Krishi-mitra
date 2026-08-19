import { NextResponse } from "next/server";
import { signJWT } from "@/lib/jwt";

export async function POST(req: Request) {
  try {
    let state = "Punjab";
    let district = "Ludhiana";
    let village = "Samrala";

    try {
      const body = await req.json();
      if (body.state) state = body.state;
      if (body.district) district = body.district;
      if (body.village) village = body.village;
    } catch (e) {
      // Body might be empty
    }

    const token = signJWT({
      userId: "guest_farmer",
      email: "guest@krishimitra.com",
      phone: "0000000000",
      role: "Farmer",
      state,
      district,
      village,
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
