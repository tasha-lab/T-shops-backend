import { Router } from "express";
import { verify } from "../middleware/verify";
import {
  approveVendor,
  getSuspendedVendors,
  getUnapprovedVendors,
  suspendVendor,
} from "../controllers/admin.controller";

const router = Router();

router.get("/all-unapproved-vendors", verify, getUnapprovedVendors);
router.patch("/approve-vendor/:vendorId", verify, approveVendor);
router.get("/suspended-vendors", verify, getSuspendedVendors);
router.patch("/suspend-Vendor/:vendorId", verify, suspendVendor);

export default router;
