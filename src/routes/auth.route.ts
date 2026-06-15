import { Router } from "express";
import { createUser, loginUser } from "../controllers/auth.controller";

const route = Router();
route.post("/register", createUser);
route.get("/login", loginUser);

export default route;
