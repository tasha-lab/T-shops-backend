import { Router } from "express";
import { verify } from "../middleware/verify";
import { createVendor } from "../controllers/vendor.contoller";

const router = Router();

router.post("/", verify, createVendor);

export default router;
