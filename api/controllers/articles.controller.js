import ArticlesDAO from "../dao/articlesDAO.js";
import Article from "../models/Article.js";
import Authorship from "../models/Authorship.js";

export default class ArticleController {
  static async apiGetArticles(req, res, next) {
    // req.query --> /articles?title=rats
    const page = req.query.page ? parseInt(req.query.page, 10) : 1;
    const articlesPerPage = req.query.articlesPerPage
      ? parseInt(req.query.articlesPerPage, 10 /* : parseInt radix */)
      : 10;
    let filters = {};
    if (req.query.title) {
      filters.title = req.query.title;
    } /* else {
      // to-do: other filters
    } */

    // const { articlesList, totalNumArticles } = await ArticlesDAO.getArticles({
    //   filters,
    //   page,
    //   articlesPerPage,
    // });

    try {
      const { articles, totalArticles } = await Article.getArticles({
        filters,
        page,
        articlesPerPage,
      });

      if (totalArticles == 0) {
        return res
          .status(404)
          .json({ error: "No articles found", status: "error" });
      } else if (totalArticles > 0 && articles.length == 0) {
        return res.status(400).json({
          error: "Error in pagination",
          totalArticles,
          status: "error",
        });
      }

      let data = {
        articles,
        page,
        filters,
        articlesPerPage,
        totalPages: Math.ceil(totalArticles / articlesPerPage),
        totalArticles,
      };

      res.json({ data, status: "success" });
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: e.message, status: "error" });
    }
  }

  static async apigetArticleById(req, res, next) {
    try {
      // const articleId = req.params.articleId;
      // const articleResponse = await ArticlesDAO.getArticleById(articleId);
      // if (!articleResponse || articleResponse.error) {
      //   throw new Error(`No article found with Id: ${articleId}`);
      // }
      const article = await Article.getArticleById(req.params.articleId);

      res.status(200).json({ article, status: "success" });
    } catch (e) {
      res.status(404).json({ error: e.message, status: "error" });
    }
  }

  static async apiPostArticle(req, res, next) {
    try {
      const article = new Article(req.body);
      await article.save();

      const authors = req.body.authors;
      if (Array.isArray(authors)) {
        // also checks for null
        for (const authorId of authors) {
          let authorship = new Authorship({
            author: authorId,
            article: article._id,
          });
          authorship.save();
        }
      }

      res.status(201).json({ article, status: "success" });
    } catch (e) {
      console.error(e);
      res.status(400).json({ error: e.message, status: "error" });
    }
  }

  static async apiUpdateArticle(req, res, next) {
    try {
      const article = await Article.findById(req.params.articleId);

      if (!article) {
        return res.status(404).json({
          error: `No article found with id: ${req.params.articleId}`,
          status: "error",
        });
      }

      const { title, description, categories, ISCED, publishDate, content } =
        req.body;

      // make sure not to set null properties if it doesn't appear in req.body
      if (title) article.title = title;
      if (description) article.description = description;
      if (categories) article.categories = categories;
      if (ISCED) article.ISCED = ISCED;
      if (publishDate) article.publishDate = publishDate;
      if (content) article.content = content;

      await article.save();

      res.status(201).json({ article, status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message, status: "error" });
    }
  }

  static async apiDeleteArticle(req, res, next) {
    try {
      // const articleId = req.params.articleId;
      // const articleResponse = await ArticlesDAO.deleteArticleById(articleId);

      // var { error } = articleResponse;
      // if (error) {
      //   return res.status(400).json({ status: "error", error: error });
      // }

      // if (articleResponse.modifiedCount === 0) {
      //   throw new Error(`unable to delete article - No article found with Id: ${articleId}`);
      // }

      // if (articleResponse.deletedCount === 0 || articleResponse.error) {
      //   throw new Error(`No article found with Id: ${articleId}`);
      // }

      const article = await Article.findByIdAndDelete(req.params.articleId);

      if (!article) {
        return res.status(404).json({
          error: `No article found with id: ${req.params.articleId}`,
          status: "error",
        });
      }

      res.json({ article, status: "success" });
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: e.message, status: "error" });
    }
  }
}
