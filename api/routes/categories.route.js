import express from "express";
import CategoriesCtrl from "../controllers/categories.controller.js";

const router = express.Router();

router
  .route("/")
  .get(CategoriesCtrl.apiGetCategories)
  .post(CategoriesCtrl.apiPostCategory);

router
  .route("/:categoryId")
  .put(CategoriesCtrl.apiUpdateCategory)
  .delete(CategoriesCtrl.apiDeleteCategory);

export default router;
