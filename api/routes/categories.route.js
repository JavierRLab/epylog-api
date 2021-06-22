import express from "express";
import CategoriesCtrl from "../controllers/categories.controller.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router
  .route("/")
  .get(CategoriesCtrl.apiGetCategories)
  .post(auth, CategoriesCtrl.apiPostCategory);

router.route("/maincategories").get(CategoriesCtrl.apiGetMainCategories);

router
  .route("/:categoryId")
  .get(CategoriesCtrl.apiGetCategory)
  .put(auth, CategoriesCtrl.apiUpdateCategory)
  .delete(auth, CategoriesCtrl.apiDeleteCategory);

router
  .route("/:mainId/subcategories")
  .get(CategoriesCtrl.apiGetSubCategoriesByMainId);

export default router;
