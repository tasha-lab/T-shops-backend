import { Router } from "express";
import {
  createCategory,
  getCategories,
  getNestedCategories,
  updateACategory,
} from "../controllers/category.controller";
import { verify } from "../middleware/verify";

const router = Router();

router.post("/", verify, createCategory);
router.get("/categories", verify, getCategories);
router.get("/category/:slug", verify, getNestedCategories);
router.patch("/edit-Category/:slug", verify, updateACategory);

export default router;
