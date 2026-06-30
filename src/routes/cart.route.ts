import { Router } from "express";
import { verify } from "../middleware/verify";
import {
  addToCart,
  clearCart,
  deleteItem,
  getCartItems,
  updateCart,
} from "../controllers/cart.controller";

const router = Router();

router.post("/add-to-cart", verify, addToCart);
router.get("/cart-items", verify, getCartItems);
router.patch("/update-cart/:itemId", verify, updateCart);
router.delete("/delete-item/:itemId", verify, deleteItem);
router.delete("/clear-cart",verify,clearCart)

export default router;
