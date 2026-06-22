import { Request, Response } from "express";
import { createVendorService } from "../services/vendor.service";

interface userRequest extends Request {
  userId?: string;
  role?: "Admin" | "Customer" | "Vendor";
}

export const createVendor = async (req: userRequest, res: Response) => {
  try {
    const id = req.userId;
    if (!id) {
      res.status(403).json({
        message: "Please login",
      });
      return;
    }
    const { shopname, shopdescription, mpesaNumber, bankName, bankAccount } =
      req.body;
    const result = await createVendorService(
      id,
      shopname,
      shopdescription,
      mpesaNumber,
      bankName,
      bankAccount
    );
    res.status(200).json({
      message: "Vendor added successfully",
      result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server error",
    });
  }
};
