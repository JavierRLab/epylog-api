import express from "express";
import ArticlesCtrl from "../controllers/articles.controller.js";

const router = express.Router();

router
  .route("/")
  .get(ArticlesCtrl.apiGetArticles)
  .post(ArticlesCtrl.apiPostArticle);

router
  .route("/:articleId")
  .get(ArticlesCtrl.apigetArticleById)
  .put(ArticlesCtrl.apiUpdateArticle)
  .delete(ArticlesCtrl.apiDeleteArticle);

export default router;
