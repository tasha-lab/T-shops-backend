import { Router } from "express";
import { verify } from "../middleware/verify";
import { createVendor, getVendorsList } from "../controllers/vendor.controller";

const router = Router();

router.post("/", verify, createVendor);
router.get("/approved-vendors", verify, getVendorsList);

export default router;
