import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { UserModel } from "@/models/User";
import { signJWT } from "@/lib/jwt";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const {
      name,
      email,
      phone,
      password,
      gender,
      dob,
      state,
      district,
      village,
      address,
      pincode,
      gpsLocation,
      farmSize,
      farmSizeUnit,
      primaryCrop,
      soilType,
      irrigationSource,
      experience,
      preferredLanguage,
      voiceLanguage,
      profilePhoto,
    } = body;

    // Validation
    if (!name || !email || !phone || !password) {
      return NextResponse.json(
        { success: false, error: "Please fill in all required fields (Name, Email, Phone, Password)." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanPhone = phone.trim();

    // Check existing email/phone uniqueness in MongoDB
    const existingUser = await UserModel.findOne({
      $or: [{ email: cleanEmail }, { phone: cleanPhone }],
    });

    if (existingUser) {
      if (existingUser.email === cleanEmail) {
        return NextResponse.json(
          { success: false, error: "An account with this email address already exists." },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { success: false, error: "An account with this phone number already exists." },
        { status: 400 }
      );
    }

    // Hash password securely with bcrypt (10 rounds)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create complete user document in MongoDB
    const newUser = await UserModel.create({
      name,
      email: cleanEmail,
      phone: cleanPhone,
      password: hashedPassword,
      gender: gender || "Male",
      dob: dob || "",
      state: state || "Punjab",
      district: district || "Ludhiana",
      village: village || "Samrala",
      address: address || "",
      pincode: pincode || "",
      gpsLocation: gpsLocation || { lat: 30.901, lon: 75.8573 },
      farmSize: farmSize ? Number(farmSize) : 5,
      farmSizeUnit: farmSizeUnit || "Acres",
      primaryCrop: primaryCrop || "Wheat, Rice, Tomato",
      soilType: soilType || "Alluvial / Loamy",
      irrigationSource: irrigationSource || "Canal / Borewell",
      experience: experience || "5+ Years",
      preferredLanguage: preferredLanguage || "hi-IN",
      voiceLanguage: voiceLanguage || preferredLanguage || "hi-IN",
      profilePhoto: profilePhoto || "",
      role: "Farmer",
      lastLogin: new Date(),
    });

    // Generate JWT token
    const token = signJWT({
      userId: (newUser._id as any).toString(),
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
    });

    // Sanitize user output (never return password)
    const userObj = newUser.toObject();
    delete (userObj as any).password;

    const response = NextResponse.json({
      success: true,
      message: "Registration successful!",
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
    console.error("❌ Registration API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error during registration." },
      { status: 500 }
    );
  }
}
