'use server';

import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export type RegisterState = {
  success?: boolean;
  error?: string;
  fieldErrors?: { name?: string[]; email?: string[]; phone?: string[]; password?: string[]; confirmPassword?: string[] };
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function registerUser(prevState: RegisterState, formData: FormData): Promise<RegisterState> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const phone = String(formData.get("phone") || "").trim();
  const password = String(formData.get("password") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  const fieldErrors: RegisterState["fieldErrors"] = {};
  if (name.length < 2) fieldErrors.name = ["Name must be at least 2 characters"];
  if (!EMAIL_RE.test(email)) fieldErrors.email = ["Enter a valid email address"];
  if (password.length < 8) fieldErrors.password = ["Password must be at least 8 characters"];
  else if (password.length > 72) fieldErrors.password = ["Password must be 72 characters or fewer"];

  if (confirmPassword && confirmPassword !== password) {
    fieldErrors.confirmPassword = ["Passwords do not match"];
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  try {
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return { fieldErrors: { email: ["An account with this email already exists"] } };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.user.create({
      data: {
        name,
        email,
        phone: phone || null,
        password: hashedPassword,
        role: "CITIZEN", // Strictly enforce CITIZEN default role for public registration
        ecoPoints: 0,
      },
    });

    return { success: true };
  } catch (error: any) {
    console.error("Registration failed:", error);
    return { error: "Something went wrong. Please try again." };
  }
}

export async function getSystemSeedUsers() {
  try {
    const users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        ecoPoints: true,
        avatarUrl: true,
      },
      orderBy: { createdAt: 'asc' },
    });
    return { success: true, users };
  } catch (error: any) {
    console.error("Failed to fetch seed users:", error);
    return { success: false, users: [] };
  }
}
