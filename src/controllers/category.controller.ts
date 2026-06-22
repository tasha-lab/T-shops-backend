import { Request, Response } from "express";
import {
  createCategoryService,
  deleteCategoryService,
  getAllCategories,
  getCategoryService,
  updateCategoryService,
} from "../services/categories.service";

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
    const role = req.role;

    if (role !== "Admin") {
      res.status(403).json({
        message: "You are not authorized to create a category",
      });
      return;
    }
    const { name, parentId } = req.body;
    if (!name) {
      res.status(400).json({
        message: "Category name is required",
      });
      return;
    }

    const category = await createCategoryService(name, parentId);
    res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (error: any) {
    if (error.message === "CategoryExists") {
      res.status(409).json({
        message: "Category already exists",
      });
      return;
    }
    if (error.message === "ParentNotFound") {
      res.status(400).json({ message: "Parent category not found" });
      return;
    }
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
export const getCategories = async (req: UserRequest, res: Response) => {
  try {
    const id = req.userId;
    if (!id) {
      res.status(401).json({
        message: "Please Login",
      });
      return;
    }
    const allCategories = await getAllCategories();
    res.status(201).json({
      message: "Categories gotten successfully",
      allCategories,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
export const getNestedCategories = async (req: UserRequest, res: Response) => {
  try {
    const id = req.userId;
    if (!id) {
      res.status(401).json({
        message: "Please Login",
      });
      return;
    }
    const slug = req.params.slug as string;
    const categories = await getCategoryService(slug);
    if (!categories) {
      res.status(404).json({
        message: "Category not found",
      });
      return;
    }
    res.status(200).json({
      message: "Category retrieved successfully",
      categories,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
export const updateACategory = async (req: UserRequest, res: Response) => {
  try {
    const id = req.userId;
    if (!id) {
      res.status(401).json({
        message: "Please login",
      });
      return;
    }
    const { name, parentId } = req.body;
    const slug = req.params.slug as string;
    const role = req.role;
    if (role !== "Admin") {
      res.status(403).json({
        message: "You are not authorized to update a category",
      });
      return;
    }
    const update = await updateCategoryService(slug, name, parentId);
    res.status(201).json({
      message: "Category updated successfully",
      update,
    });
  } catch (error: any) {
    if (error.message == "Categorynotfound") {
      res.status(400).json({ message: "This category was not found" });
      return;
    }
    if (error.message == "thiscategoryexists") {
      res.status(400).json({
        message: "A category with this name already exists",
      });
      return;
    }
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
export const deleteCategory = async (req: UserRequest, res: Response) => {
  try {
    const id = req.userId;
    if (!id) {
      res.status(401).json({
        message: "Please login",
      });
      return;
    }
    const slug = req.params.slug as string;
    const role = req.role;
    if (role !== "Admin") {
      res.status(403).json({
        message: "You are not authorized to delete a category",
      });
      return;
    }
    await deleteCategoryService(slug);
    res.status(200).json({
      message: "Category deleted successfully",
    });
  } catch (error: any) {
    console.log(error);
    if (error.message == "CategorynotFound") {
      res.status(400).json({
        message: "This category does not exists",
      });
      return;
    }
    if (error.message == "CategoryHasChildren") {
      res.status(400).json({
        message: "Can't delete a category with children",
      });
      return;
    }
    if (error.message == "CategoryHasProducts") {
      res.status(400).json({
        message: "Can't delete a category with products",
      });
      return;
    }
    res.status(500).json({
      message: "Internal server Error",
    });
  }
};
