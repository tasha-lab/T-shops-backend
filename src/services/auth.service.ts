import { client } from "../config/prismaClient";
import { hashOTP, generateOTP, getOTPExpiry } from "../utils/otputils";
import { sendOTPEmail } from "../utils/sendemail.utils";
import bcrypt from "bcryptjs";
import { OtpPurpose, role } from "../../generated/prisma/client";

interface userRequest extends Request {
  userId?: string;
}

export const findExistingUser = async (email: string, username: string) => {
  return await client.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });
};

export const createNewUser = async (userData: {
  firstname: string;
  lastname: string;
  email: string;
  username: string;
  password: string;
  phonenumber: string;
  role: role;
}) => {
  return await client.user.create({
    data: userData,
  });
};

export const findLoginUser = async (identifier: string) => {
  return await client.user.findFirst({
    where: {
      OR: [{ email: identifier }, { username: identifier }],
    },
  });
};

export const createAndSendOTP = async (
  userId: string,
  email: string,
  purpose: OtpPurpose
) => {
  const otp = generateOTP();
  const hash = hashOTP(otp);
  const expiresAt = getOTPExpiry();

  await client.otpToken.create({
    data: {
      userId,
      hash,
      purpose,
      expiresAt,
    },
  });

  await sendOTPEmail(email, otp);
};

export const verifyOTP = async (email: string, otp: string) => {
  const user = await client.user.findUnique({ where: { email } });
  if (!user) return { success: false, message: "User not found" };

  const hashedOTP = hashOTP(otp);
  const otpRecord = await client.otpToken.findFirst({
    where: {
      userId: user.id,
      hash: hashedOTP,
      purpose: OtpPurpose.EmailVerification,
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
  });

  if (!otpRecord) return { success: false, message: "Invalid or expired OTP" };

  await client.otpToken.update({
    where: { id: otpRecord.id },
    data: { usedAt: new Date() },
  });

  await client.user.update({
    where: { id: user.id },
    data: { isEmailVerified: true },
  });

  return { success: true, message: "Email verified successfully" };
};

export const resendOTPService = async (email: string) => {
  const user = await client.user.findUnique({ where: { email } });
  if (!user) return { success: false, message: "User not found" };

  if (user.isEmailVerified) {
    return { success: false, message: "Email is already verified" };
  }

  await client.otpToken.updateMany({
    where: {
      userId: user.id,
      purpose: OtpPurpose.EmailVerification,
      usedAt: null,
    },
    data: { usedAt: new Date() },
  });

  await createAndSendOTP(user.id, email, OtpPurpose.EmailVerification);
  return { success: true, message: "OTP resent successfully" };
};

export const sendPasswordResetOTP = async (email: string) => {
  const user = await client.user.findUnique({ where: { email } });
  if (!user) return { success: false, message: "User not found" };

  await client.otpToken.updateMany({
    where: {
      userId: user.id,
      purpose: OtpPurpose.PasswordReset,
      usedAt: null,
    },
    data: { usedAt: new Date() },
  });

  await createAndSendOTP(user.id, email, OtpPurpose.PasswordReset);
  return { success: true, message: "Password reset OTP sent" };
};

export const resetPassword = async (
  email: string,
  otp: string,
  newPassword: string
) => {
  const user = await client.user.findUnique({ where: { email } });
  if (!user) return { success: false, message: "User not found" };

  const hashedOTP = hashOTP(otp);
  const otpRecord = await client.otpToken.findFirst({
    where: {
      userId: user.id,
      hash: hashedOTP,
      purpose: OtpPurpose.PasswordReset,
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
  });

  if (!otpRecord) return { success: false, message: "Invalid or expired OTP" };

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await client.otpToken.update({
    where: { id: otpRecord.id },
    data: { usedAt: new Date() },
  });

  await client.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });

  return { success: true, message: "Password reset successful" };
};
