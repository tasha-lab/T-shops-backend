import { transporter } from "../config/emailconfig"

export const sendOTPEmail = async (
  email: string,
  otp: string
): Promise<void> => {
  await transporter.sendMail({
    from: `"T-shops" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Email Verification OTP",
    html: `
      <h2>Email Verification</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>This OTP expires in 10 minutes.</p>
      <p>If you did not request this, ignore this email.</p>
    `,
  });
};
