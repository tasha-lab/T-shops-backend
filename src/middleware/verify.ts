import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface userRequest extends Request {
  userId?: string;
}

export const verify = async (
  req: userRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeaders = req.headers.authorization;

  if (!authHeaders || !authHeaders.startsWith("Bearer ")) {
    res.status(401).json({
      message: "Please login",
    });
    return;
  }
  const token = authHeaders.split(" ")[1].trim();
  if (!token) {
    res.status(401).json({
      message: "Cant login.Incorrect token",
    });
    return;
  }
  try {
    const secret = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    req.userId = secret.userId;
    next();
  } catch (error) {
    res.status(403).json({ message: "Please login first" });
    console.log(error);
    return;
  }
};
