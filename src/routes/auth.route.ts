import { Router } from "express";
import {
  createUser,
  forgotPassword,
  loginUser,
  resendOTP,
  resetUserPassword,
  verifyEmail,
} from "../controllers/auth.controller";

const route = Router();
route.post("/register", createUser);
route.post("/login", loginUser);
route.post("/verify-email", verifyEmail);
route.post("/resend-otp", resendOTP);
route.post("/forgot-password", forgotPassword);
route.post("/reset-password", resetUserPassword);

export default route;
