import { Request, Response } from "express";
import { createProduct } from "../services/products.service";

interface UserRequest extends Request {
  userId?: string;
  role?: "Admin" | "Customer" | "Vendor";
}

export const addProduct = async (req: UserRequest, res: Response) => {
  try {
    const id = req.userId;
    if (!id) {
      res.status(401).json({
        message: "Please login",
      });
      return;
    }
    const role = req.role;
    if (role !== "Admin" && role !== "Vendor") {
      res.status(400).json({
        message: "You cannot add a product",
      });
      return;
    }
    const vendorId = req.userId as string;
    const { name, description, categoryId, productImage, productVariants } =
      req.body;
    const createProd = await createProduct(
      name,
      description,
      categoryId,
      vendorId,
      productImage,
      productVariants
    );
    res.status(200).json({
      message: "Product added successfully",
      createProd,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
