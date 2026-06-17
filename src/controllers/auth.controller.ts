import { Request, Response } from "express";
import validator from "validator";
import {
  createAndSendOTP,
  createNewUser,
  findExistingUser,
  findLoginUser,
  resendOTPService,
  resetPassword,
  sendPasswordResetOTP,
  verifyOTP,
} from "../services/auth.service";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OtpPurpose } from "../../generated/prisma/client";

interface userRequest extends Request {
  userId?: string;
}

export const createUser = async (req: userRequest, res: Response) => {
  try {
    const { firstname, lastname, email, username, password, phonenumber,role } =
      req.body;
    if (
      !firstname?.trim() ||
      !lastname?.trim() ||
      !email?.trim() ||
      !username?.trim() ||
      !password?.trim() ||
      !phonenumber?.trim() ||
      !role?.trim()
    ) {
      res.status(401).json({
        message: "All field must be filled correctly",
      });
      return;
    }
    if (!validator.isEmail(email)) {
      res.status(401).json({
        message: "Invalid email format ",
      });
      return;
    }
    if (username.length < 3 || username.length > 20) {
      res.status(400).json({
        message: "Username must be 3-20 characters long",
      });
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      res.status(400).json({
        message: "Username can only contain letters, numbers, and underscores",
      });
      return;
    }
    if (firstname.length < 2 || lastname.length < 2) {
      res.status(400).json({
        message: "First and last names must be at least 2 characters",
      });
      return;
    }
    const passwordErrors = [];

    if (password.length < 8) {
      passwordErrors.push("at least 8 characters");
    }
    if (!/[A-Z]/.test(password)) {
      passwordErrors.push("one uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      passwordErrors.push("one lowercase letter");
    }
    if (!/\d/.test(password)) {
      passwordErrors.push("one number");
    }
    if (!/[@$!%*?&#]/.test(password)) {
      passwordErrors.push("one special character (@$!%*?&#)");
    }

    if (passwordErrors.length > 0) {
      res.status(400).json({
        message: `Password must contain ${passwordErrors.join(", ")}`,
      });
      return;
    }
    const allowedRoles = ["Customer", "Vendor"];
    if (!allowedRoles.includes(role)) {
      res.status(400).json({ message: "Invalid role selection" });
      return; 
    }
    const existingUser = await findExistingUser(email, username);
    if (existingUser) {
      res.status(409).json({
        message: "User with this email or username already exists",
      });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createNewUser({
      firstname,
      lastname,
      email,
      username,
      password: hashedPassword,
      phonenumber,
      role,
    });
    await createAndSendOTP(newUser.id, email, OtpPurpose.EmailVerification);
    res.status(201).json({
      message:
        "Account created. Please verify your email with the code sent to you.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
export const loginUser = async (req: userRequest, res: Response) => {
  try {
    const { identifier, password } = req.body;
    const user = await findLoginUser(identifier);
    if (!user) {
      res.status(404).json({
        message: "Invalid credentials",
      });
      return;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({
        message: "Invalid credentials",
      });
      return;
    }
    if (!user.isEmailVerified) {
      res.status(403).json({
        message: "Please verify your email first",
      });
      return;
    }
    const { id, password: _, updatedAt, ...rest } = user;
    const token = jwt.sign(
      { userId: user.id, firstname: user.firstname },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );
    res.status(200).json({
      message: "Login successful",
      token,
      user: rest,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
export const verifyEmail = async (req: userRequest, res: Response) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      res.status(400).json({ message: "Email and OTP are required" });
      return;
    }
    const result = await verifyOTP(email, otp);
    if (!result.success) {
      res.status(400).json({ message: result.message });
      return;
    }
    res.status(200).json({ message: result.message });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const resendOTP = async (req: userRequest, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ message: "Email is required" });
      return;
    }
    const result = await resendOTPService(email);
    if (!result.success) {
      res.status(400).json({ message: result.message });
      return;
    }
    res.status(200).json({ message: result.message });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const forgotPassword = async (req: userRequest, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ message: "Email is required" });
      return;
    }
    const result = await sendPasswordResetOTP(email);
    if (!result.success) {
      res.status(400).json({ message: result.message });
      return;
    }
    res.status(200).json({ message: result.message });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const resetUserPassword = async (req: userRequest, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }
    const result = await resetPassword(email, otp, newPassword);
    if (!result.success) {
      res.status(400).json({ message: result.message });
      return;
    }
    res.status(200).json({ message: result.message });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
