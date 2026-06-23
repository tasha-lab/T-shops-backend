import { Request, Response } from "express";
import {
  createProduct,
  deleteThisProduct,
  editProduct,
  getAllProducts,
  getoneProduct,
  vendorsProduct,
} from "../services/products.service";

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
  } catch (error: any) {
    if (error.message == "VendorNotFound") {
      res.status(401).json({
        message: "This vendor was not found",
      });
      return;
    }
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
export const listProducts = async (req: UserRequest, res: Response) => {
  try {
    const id = req.userId;
    if (!id) {
      res.status(401).json({
        message: "Please login",
      });
      return;
    }
    const products = await getAllProducts();
    res.status(200).json({
      message: "Products retrived successfully",
      products,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
export const getProduct = async (req: UserRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({
        message: "Please login",
      });
      return;
    }
    const id = req.params.id as string;
    const result = await getoneProduct(id);
    if (!result) {
      res.status(401).json({
        message: "Product not found",
      });
      return;
    }
    res.status(200).json({
      message: "Product gotten successfully",
      result,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server Error",
    });
  }
};
export const updateProduct = async (req: UserRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({
        message: "Please login",
      });
      return;
    }
    const role = req.role;
    if (role !== "Admin" && role !== "Vendor") {
      res.status(400).json({
        message: "You cannot update a product",
      });
      return;
    }
    const { name, description, categoryId, productImage, productVariants } =
      req.body;
    const id = req.params.id as string;
    const editedProduct = await editProduct(
      id,
      name,
      description,
      categoryId,
      productImage,
      productVariants
    );
    res.status(200).json({
      message: "Product has been edited successfully",
      editedProduct,
    });
  } catch (error: any) {
    if (error.message == "ProductNotFound") {
      res.status(404).json({
        message: "This product does not exist",
      });
      return;
    }
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
export const deleteProduct = async (req: UserRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({
        message: "Please login",
      });
      return;
    }
    const role = req.role;
    if (role !== "Admin" && role !== "Vendor") {
      res.status(400).json({
        message: "You are not authorized to delete a product",
      });
      return;
    }
    const id = req.params.id as string;
    await deleteThisProduct(id);
    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error: any) {
    if (error.message == "ProductDoesNotExist") {
      res.status(404).json({
        message: "This product does not exist",
      });
      return;
    }
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
export const getVendorProduct = async (req: UserRequest, res: Response) => {
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
        message: "You are not authorized to view these products",
      });
      return;
    }
    const vendorId = req.userId as string;
    const result = await vendorsProduct(vendorId);
    res.status(200).json({
      message: "Products retrieved successfully",
      result,
    });
  } catch (error: any) {
    if (error.message == "VendorNotFound") {
      res.status(404).json({
        message: "This vendor was not found",
      });
      return;
    }
    res.status(500).json({
      message: "Internal Server error",
    });
  }
};
