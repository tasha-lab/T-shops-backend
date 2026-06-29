import { Request, Response } from "express";
import { addItem, gettingItems } from "../services/cart.service";

interface UserRequest extends Request {
  userId?: string;
  role?: "Admin" | "Customer" | "Vendor";
}

export const addToCart = async (req: UserRequest, res: Response) => {
  try {
    const id = req.userId;
    if (!id) {
      res.status(401).json({
        message: "Please login",
      });
      return;
    }
    const { variantId, quantity } = req.body;
    if (!variantId || !quantity || quantity < 1) {
      res.status(400).json({
        message: "variantId and a positive quantity are required",
      });
      return;
    }

    const addedCart = await addItem(id, variantId, quantity);
    res.status(200).json({
      message: "Item added successfully",
      addedCart,
    });
  } catch (error: any) {
    if (error.message == "ProductVariantNotFound") {
      res.status(401).json({
        message: "This product variant does not exist",
      });
      return;
    }
    if (error.message == "productIsNotAvailalble") {
      res.status(401).json({
        message: "This product is not available",
      });
      return;
    }
    res.status(500).json({
      message: "Internal server Error",
    });
  }
};
export const getCartItems = async (req: UserRequest, res: Response) => {
  try {
    const id = req.userId;
    if (!id) {
      res.status(401).json({
        message: "Please login",
      });
      return;
    }
    const cart = await gettingItems(id);
    res.status(200).json({
      message: "Cart retrived successfully",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server Error",
    });
  }
};
