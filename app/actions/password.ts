"use server";

import { prisma } from "@/app/lib/prisma";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { hashPassword } from "@/app/lib/auth";

export async function requestPasswordReset(formData: FormData) {
  const email = formData.get("email") as string;
  
  if (!email) {
    return { error: "Email address is required." };
  }

  const user = await prisma.user.findUnique({ where: { email } });

  // CHANGED: Now it will explicitly tell the user if the account doesn't exist
  if (!user) {
    return { error: "No account found with this email address." };
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60);

  await prisma.passwordResetToken.deleteMany({
    where: { userId: user.id },
  });

  await prisma.passwordResetToken.create({
    data: {
      token,
      expiresAt,
      userId: user.id,
    },
  });

  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${token}`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"Entrepreneurship Portal" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset your portal password",
    html: `
      <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #E2E8F0; border-radius: 8px;">
        <h2 style="color: #0F2747;">Password Reset Request</h2>
        <p style="color: #5B6474; line-height: 1.6;">
          We received a request to reset the password for your Entrepreneurship Portal account. 
          Click the button below to choose a new password. This link will expire in 1 hour.
        </p>
        <a href="${resetUrl}" style="display: inline-block; margin-top: 16px; padding: 12px 24px; background-color: #0F2747; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;">
          Reset Password
        </a>
        <p style="margin-top: 24px; font-size: 12px; color: #7A8494;">
          If you did not request this, you can safely ignore this email. Your password will remain unchanged.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    // If the email fails to send, this will print the exact reason in your VS Code terminal
    console.error("Email send failed:", error);
    return { error: "Failed to send reset email. Please try again later." };
  }
}


// ... existing requestPasswordReset function ...

export async function resetPassword(formData: FormData) {
  const token = formData.get("token") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!token) return { error: "Invalid or missing reset token." };
  if (password !== confirmPassword) return { error: "Passwords do not match." };
  if (password.length < 8) return { error: "Password must be at least 8 characters." };

  // Find the token in the database
  const resetTokenRecord = await prisma.passwordResetToken.findUnique({
    where: { token },
  });

  if (!resetTokenRecord) {
    return { error: "Invalid reset link. Please request a new one." };
  }

  // Check if the 1-hour expiration has passed
  if (new Date() > resetTokenRecord.expiresAt) {
    await prisma.passwordResetToken.delete({ where: { id: resetTokenRecord.id } });
    return { error: "This reset link has expired. Please request a new one." };
  }

  // Hash the new password
  const passwordHash = await hashPassword(password);

  // Update the user's password in the database
  await prisma.user.update({
    where: { id: resetTokenRecord.userId },
    data: { passwordHash },
  });

  // Delete all tokens for this user so the link can never be used again
  await prisma.passwordResetToken.deleteMany({
    where: { userId: resetTokenRecord.userId },
  });

  return { success: true };
}