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

    await connectDB();
    const user = await UserModel.findById(payload.userId).select("-password");

    if (!user) {
      return NextResponse.json(
        { success: false, authenticated: false, error: "User account not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      authenticated: true,
      user: user.toObject(),
    });
  } catch (error: any) {
    console.error("❌ Auth Me API Error:", error);
    return NextResponse.json(
      { success: false, authenticated: false, error: error.message },
      { status: 500 }
    );
  }
}
