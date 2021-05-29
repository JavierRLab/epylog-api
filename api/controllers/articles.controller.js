import ArticlesDAO from "../dao/articlesDAO.js";

export default class ArticleController {
  static async apiGetArticles(req, res, next) {
    // req.query --> /articles?title=rats
    const articlesPerPage = req.query.articlesPerPage
      ? parseInt(req.query.articlesPerPage, 10 /* : parseInt radix */)
      : 10;
    const page = req.query.page ? parseInt(req.query.page, 10) : 0;
    let filters = {};
    if (req.query.ISCED) {
      //mejorable
      filters.ISCED = req.query.ISCED;
    } else if (req.query.title) {
      filters.title = req.query.title;
    }

    const { articlesList, totalNumArticles } = await ArticlesDAO.getArticles({
      filters,
      page,
      articlesPerPage,
    });

    let articlesResponse = {
      articles: articlesList,
      page: page,
      filters: filters,
      entries_per_page: articlesPerPage,
      total_results: totalNumArticles,
    };

    res.json({ response: articlesResponse, status: "success" });
  }

  static async apigetArticleById(req, res, next) {
    try {
      const articleId = req.params.articleId;
      const articleResponse = await ArticlesDAO.getArticleById(articleId);

      if (!articleResponse || articleResponse.error) {
        throw new Error(`No article found with Id: ${articleId}`);
      }

      res.json({ response: articleResponse, status: "success" });
    } catch (e) {
      res.status(404).json({ errorNo: 404, msg: e.message });
    }
  }

  static async apiPostArticle(req, res, next) {
    try {
      const title = req.body.title;
      const description = req.body.description;
      const arCategories = req.body.arCategories;
      const ISCED = req.body.ISCED;
      const publishDate = req.body.publishDate;
      const content = req.body.content;

      const uploadDate = new Date();

      const articleResponse = await ArticlesDAO.addArticle(
        title,
        description,
        arCategories,
        ISCED,
        publishDate,
        content,
        uploadDate
      );

      res.json({ /* response: articleResponse, */ status: "success" });
    } catch (e) {
      res.status(500).json({ errorNo: 500, msg: e.message });
    }
  }

  static async apiUpdateArticle(req, res, next) {
    try {
      const articleId = req.params.articleId;

      const title = req.body.title;
      const description = req.body.description;
      const arCategories = req.body.arCategories;
      const ISCED = req.body.ISCED;
      const publishDate = req.body.publishDate;
      const content = req.body.content;

      const uploadDate = new Date();

      const articleResponse = await ArticlesDAO.updateArticle(
        articleId,
        title,
        description,
        arCategories,
        ISCED,
        publishDate,
        content,
        uploadDate
      );

      // var { error } = articleResponse;
      // if (error) {
      //   res.status(400).json({ status: "error", error: error });
      // }

      // if (articleResponse.modifiedCount === 0) {
      //   throw new Error("Unable to update article");
      // }

      if (articleResponse.modifiedCount === 0 || articleResponse.error) {
        throw new Error(`No article found with Id: ${articleId}`);
      }

      res.json({ /* response: articleResponse, */ status: "success" });
    } catch (e) {
      res.status(500).json({ errorNo: 500, msg: e.message });
    }
  }

  static async apiDeleteArticle(req, res, next) {
    try {
      const articleId = req.params.articleId;
      const articleResponse = await ArticlesDAO.deleteArticleById(articleId);

      // var { error } = articleResponse;
      // if (error) {
      //   return res.status(400).json({ status: "error", error: error });
      // }

      // if (articleResponse.modifiedCount === 0) {
      //   throw new Error(`unable to delete article - No article found with Id: ${articleId}`);
      // }

      if (articleResponse.deletedCount === 0 || articleResponse.error) {
        throw new Error(`No article found with Id: ${articleId}`);
      }

      res.json({ /* response: articleResponse, */ status: "success" });
    } catch (e) {
      res.status(500).json({ errorNo: 500, msg: e.message });
    }
  }
}
