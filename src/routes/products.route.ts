import { Router } from "express";
import { verify } from "../middleware/verify";
import {
  addProduct,
  deleteProduct,
  getProduct,
  getVendorProduct,
  listProducts,
  updateProduct,
} from "../controllers/products.controller";

const router = Router();
router.post("/create-product", verify, addProduct);
router.get("/products", verify, listProducts);
router.get("/single-Product/:id", verify, getProduct);
router.patch("/edit-Product/:id", verify, updateProduct);
router.delete("/delete-Product/:id", verify, deleteProduct);
router.get("/vendors-Product", verify, getVendorProduct);

export default router;
