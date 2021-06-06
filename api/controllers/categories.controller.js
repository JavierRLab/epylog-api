// import { response } from "express";
// import CategoriesDAO from "../dao/categoriesDAO.js";
import Category from "../models/Category.js";

export default class CategoryController {
  static async apiGetCategories(req, res, next) {
    // vanilla mongo:

    //   const categoriesList = await CategoriesDAO.getCategories();
    //   console.log(categoriesList);
    //   let categoriesResponse = { categories: categoriesList };
    //   res.json({ categoriesResponse, status: "success" });

    try {
      const categories = await Category.getAllCategories();
      res.status(200).json({ categories, status: "success" });
    } catch (e) {
      res.status(404).json({ error: e.message, status: "error" });
    }
  }

  static async apiGetCategory(req, res, next) {
    try {
      const category = await Category.getCategoryById(req.params.categoryId);
      res.status(200).json({ category, status: "success" });
    } catch (e) {
      res.status(404).json({ error: e.message, status: "error" });
    }
  }

  static async apiGetMainCategories(req, res, next) {
    try {
      const categories = await Category.getMainCategories();
      res.status(200).json({ categories, status: "success" });
    } catch (e) {
      res.status(404).json({ error: e.message, status: "error" });
    }
  }

  static async apiGetSubCategoriesByMainId(req, res, next) {
    try {
      const categories = await Category.getSubCategoriesByMainId(
        req.params.mainId
      );
      res.status(200).json({ categories, status: "success" });
    } catch (e) {
      res.status(404).json({ error: e.message, status: "error" });
    }
  }

  static async apiPostCategory(req, res, next) {
    try {
      // vanilla mongo:

      // const name = req.body.name;
      // const mainCategory = req.body.mainCategory;

      // const category = await CategoriesDAO.addCategory(
      //   name,
      //   mainCategory
      // );

      const category = new Category(req.body);
      await category.save();

      res.status(201).json({ category, status: "success" });
    } catch (e) {
      res.status(400).json({ error: e.message, status: "error" });
    }
  }

  static async apiUpdateCategory(req, res, next) {
    try {
      const category = await Category.findById(req.params.categoryId);

      if (!category) {
        return res.status(404).json({
          error: `No category found with id: ${req.params.categoryId}`,
          status: "error",
        });
      }

      const { name, mainCategory } = req.body;

      if (name) category.name = name;
      if (mainCategory) category.mainCategory = mainCategory;

      category.save();
      // this method doesnt ensure schema validation
      // const data = await Category.findOneAndUpdate(
      //   { _id: req.params.categoryId },
      //   req.body
      // );
      // to-do: other status
      res.status(201).json({ data, status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message, status: "error" });
    }
  }

  static async apiDeleteCategory(req, res, next) {
    try {
      // vanilla mongo:

      // const categoryId = req.params.categoryId;
      // console.log(categoryId);
      // const categoryResponse = await CategoriesDAO.deleteCategoryById(
      //   categoryId
      // );

      // if (categoryResponse.deletedCount === 0 || categoryResponse.error) {
      //   throw new Error(`No article found with Id: ${categoryId}`);
      // }

      const data = await Category.findByIdAndDelete(req.params.categoryId);

      res.json({ data, status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message, status: "error" });
    }
  }
}
