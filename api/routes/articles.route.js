import express from "express";
import ArticlesCtrl from "../controllers/articles.controller.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router
  .route("/")
  .get(ArticlesCtrl.apiGetArticles)
  .post(auth, ArticlesCtrl.apiPostArticle);

router
  .route("/:articleId")
  .get(ArticlesCtrl.apigetArticleById)
  .put(auth, ArticlesCtrl.apiUpdateArticle)
  .delete(auth, ArticlesCtrl.apiDeleteArticle);

export default router;
