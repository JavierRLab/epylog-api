import express from "express";
import CategoriesCtrl from "../controllers/categories.controller.js";

const router = express.Router();

router
  .route("/")
  .get(CategoriesCtrl.apiGetCategories)
  .post(CategoriesCtrl.apiPostCategory);

router.route("/maincategories").get(CategoriesCtrl.apiGetMainCategories);

router
  .route("/:categoryId")
  .get(CategoriesCtrl.apiGetCategory)
  .put(CategoriesCtrl.apiUpdateCategory)
  .delete(CategoriesCtrl.apiDeleteCategory);

router
  .route("/:mainId/subcategories")
  .get(CategoriesCtrl.apiGetSubCategoriesByMainId);

export default router;
