import { response } from "express";
import CategoriesDAO from "../dao/categoriesDAO.js";

export default class CategoryController {
  static async apiGetCategories(req, res, next) {
    const categoriesList = await CategoriesDAO.getCategories();
    console.log(categoriesList);
    let categoriesResponse = { categories: categoriesList };
    res.json({ response: categoriesResponse, status: "success" });
  }

  static async apiPostCategory(req, res, next) {
    try {
      const name = req.body.name;
      const mainCategory = req.body.mainCategory;

      const categoryResponse = await CategoriesDAO.addCategory(
        name,
        mainCategory
      );

      res.json({ /* response: categoryResponse, */ status: "success" });
    } catch (e) {
      res.status(500).json({ errorNo: 500, msg: e.message });
    }
  }

  static async apiUpdateCategory(req, res, next) {
    try {
      const categoryId = req.params.categoryId;
      const name = req.body.name;
      const mainCategory = req.body.mainCategory;

      const categoryResponse = await CategoriesDAO.updateCategory(
        categoryId,
        name,
        mainCategory
      );

      // var { error } = categoryResponse;
      // if (error) {
      //   res.status(400).json({ error });
      // }

      // if (categoryResponse.modifiedCount === 0) {
      //   throw new Error(
      //     "unable to update article - user may not be original poster"
      //   );
      // }

      if (categoryResponse.modifiedCount === 0 || categoryResponse.error) {
        throw new Error(`No article found with Id: ${categoryId}`);
      }

      res.json({ /* response: categoryResponse, */ status: "success" });
    } catch (e) {
      res.status(500).json({ errorNo: 500, msg: e.message });
    }
  }

  static async apiDeleteCategory(req, res, next) {
    try {
      const categoryId = req.params.categoryId;
      console.log(categoryId);
      const categoryResponse = await CategoriesDAO.deleteCategoryById(
        categoryId
      );

      if (categoryResponse.deletedCount === 0 || categoryResponse.error) {
        throw new Error(`No article found with Id: ${categoryId}`);
      }

      res.json({ /* response: categoryResponse, */ status: "success" });
    } catch (e) {
      res.status(500).json({ errorNo: 500, msg: e.message });
    }
  }
}
