import { Request, Response } from "express";
import { createCategoryService } from "../services/categories.service";

interface UserRequest extends Request {
  userId?: string;
  role?: "Admin" | "Customer" | "Vendor";
}

export const createCategory = async (req: UserRequest, res: Response) => {
  try {
    const id = req.userId;
    if (!id) {
      res.status(401).json({
        message: "Please login",
      });
      return;
    }
    const role = req.role

    if (role !== "Admin") {
      res.status(403).json({
        message: "You are not authorized to create a category",
      });
      return;
    }
    const {name,parentId}=req.body
    if(!name){
        res.status(400).json({
            message:"Category name is required"
        })
        return
    }
    const category=await createCategoryService(name,parentId)
    res.status(201).json({
        message:"Category created successfully",
        category
    })

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
