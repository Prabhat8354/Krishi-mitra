import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { UserModel } from "@/models/User";
import { signJWT } from "@/lib/jwt";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { emailOrPhone, password } = body;

    if (!emailOrPhone || !password) {
      return NextResponse.json(
        { success: false, error: "Please enter your Email/Phone and Password." },
        { status: 400 }
      );
    }

    const identifier = emailOrPhone.trim().toLowerCase();

    // Find user by email or phone
    const user = await UserModel.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "No account found matching those credentials." },
        { status: 401 }
      );
    }

    // Verify password with bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Incorrect password. Please try again." },
        { status: 401 }
      );
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = signJWT({
      userId: (user._id as any).toString(),
      email: user.email,
      phone: user.phone,
      role: user.role,
    });

    const userObj = user.toObject();
    delete (userObj as any).password;

    const response = NextResponse.json({
      success: true,
      message: "Login successful!",
      user: userObj,
    });

    // Set HttpOnly Secure Cookie
    response.cookies.set("krishi_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("❌ Login API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error during login." },
      { status: 500 }
    );
  }
}
