import { Request, Response } from "express";
import {
  approve,
  getSuspendedVendor,
  getUnapprovedVendor,
  suspend,
} from "../services/admin.service";

interface userRequest extends Request {
  userId?: string;
  role?: "Admin" | "Customer" | "Vendor";
}

export const getUnapprovedVendors = async (req: userRequest, res: Response) => {
  try {
    const id = req.userId;
    if (!id) {
      res.status(401).json({
        message: "Please Login",
      });
      return;
    }
    const role = req.role;
    if (role !== "Admin") {
      res.status(403).json({
        message: "You are not authorized to get unapproved vendors",
      });
      return;
    }
    const unapprovedVendors = await getUnapprovedVendor();
    res.status(500).json({
      message: "Vendors gotten successfully",
      unapprovedVendors,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server Error",
    });
  }
};
export const approveVendor = async (req: userRequest, res: Response) => {
  try {
    const id = req.userId;
    if (!id) {
      res.status(401).json({
        message: "Please login",
      });
      return;
    }
    const role = req.role;
    if (role !== "Admin") {
      res.status(403).json({
        message: "You are not authorized to approve vendors",
      });
      return;
    }
    const vendorId = req.params.vendorId as string;
    const approved = await approve(vendorId);
    res.status(200).json({
      message: "Vendor has been successfully approved",
      approved,
    });
  } catch (error: any) {
    if (error.message == "VendorNotFound") {
      res.status(401).json({
        message: "This vendor does not exist",
      });
      return;
    }
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
export const getSuspendedVendors = async (req: userRequest, res: Response) => {
  try {
    const id = req.userId;
    if (!id) {
      res.status(401).json({
        message: "Please Login",
      });
      return;
    }
    const role = req.role;
    if (role !== "Admin") {
      res.status(403).json({
        message: "You are not authorized to get suspended vendors",
      });
      return;
    }
    const suspendedVendors = await getSuspendedVendor();
    res.status(200).json({
      message: "Vendors gotten successfully",
      suspendedVendors,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server Error",
    });
  }
};
export const suspendVendor = async (req: userRequest, res: Response) => {
  try {
    const id = req.userId;
    if (!id) {
      res.status(401).json({
        message: "Please login",
      });
      return;
    }
    const role = req.role;
    if (role !== "Admin") {
      res.status(403).json({
        message: "You are not authorized to approve vendors",
      });
      return;
    }
    const vendorId = req.params.vendorId as string;
    const suspended = await suspend(vendorId);
    res.status(200).json({
      message: "Vendor has been successfully suspended",
      suspended,
    });
  } catch (error: any) {
    if (error.message == "VendorNotFound") {
      res.status(401).json({
        message: "This vendor does not exist",
      });
      return;
    }
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
