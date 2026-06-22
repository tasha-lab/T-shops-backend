import { Router } from "express";
import { verify } from "../middleware/verify";
import { addProduct } from "../controllers/products.controller";

const router = Router();
router.post("/create-product", verify, addProduct);

export default router;
