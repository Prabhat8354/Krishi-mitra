import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "krishimitra_production_jwt_secret_key_2026_safe";

export interface JWTPayload {
  userId: string;
  email: string;
  phone: string;
  role: string;
  state?: string;
  district?: string;
  village?: string;
}

export function signJWT(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyJWT(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}
