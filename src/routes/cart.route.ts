import { Router } from "express";
import { verify } from "../middleware/verify";
import { addToCart, getCartItems } from "../controllers/cart.controller";

const router = Router();

router.post("/add-to-cart", verify, addToCart);
router.get("/cart-items", verify, getCartItems);

export default router;
