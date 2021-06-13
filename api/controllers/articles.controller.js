import ArticlesDAO from "../dao/articlesDAO.js";
import Article from "../models/Article.js";
import Authorship from "../models/Authorship.js";
/**
 * @swagger
 * tags:
 *  name: Articles
 *  description: The Articles managed by the API
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    Article:
 *      type: Object
 *      properties:
 *        _id:
 *          type: String
 *          description: Auto-generated id
 *        title:
 *          type: String
 *        description:
 *          type: String
 *        categories:
 *          type: String
 */

export default class ArticleController {
  /**
   * @swagger
   * /articles:
   *  get:
   *    summary: Returns a filtered list of Articles
   *    tags: [Articles]
   *    parameters:
   *      - in: query
   *        name: title
   *        schema:
   *          type: String
   *        description: The title to Search for Articles
   *      - in: query
   *        name: page
   *        schema:
   *          type: Integer
   *          min: 1
   *          default: 1
   *        description: The starting page of the Search
   *      - in: query
   *        name: articlesPerPage
   *        schema:
   *          type: Integer
   *        min: 1
   *        default: 10
   *        description: The Articles per page of the Search
   *    responses:
   *      200:
   *        description: The list of the Articles and pagination data
   *        content:
   *          application/json:
   *            schema:
   *              $ref: ''
   *            example:
   *              data:
   *                articles: [{},{}]
   *                filters: { title: "stronger" }
   *                page: 1
   *                articlesPerPage: 2
   *                totalPages: 6
   *                totalArticles: 11
   *              status: "success"
   *      400:
   *        description: Error in pagination
   *        content:
   *          application/json:
   *            example:
   *              error: "Error in pagination"
   *              status: "error"
   *      404:
   *        description: No articles found
   *        content:
   *          application/json:
   *            example:
   *              error: "No articles found"
   *              status: "error"
   *      500:
   *        description: Internal Server Error
   *        content:
   *          application/json:
   *            example:
   *              error: "Internal Server Error"
   *              status: "error"
   */
  static async apiGetArticles(req, res, next) {
    const page = req.query.page ? parseInt(req.query.page, 10) : 1;
    const articlesPerPage = req.query.articlesPerPage
      ? parseInt(req.query.articlesPerPage, 10 /* : parseInt radix */)
      : 10;
    let filters = {};
    if (req.query.title) {
      filters.title = req.query.title;
    }

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
        filters,
        page,
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

  /**
   * @swagger
   * /articles/{id}:
   *  get:
   *    summary: Get the Article by Id
   *    tags: [Articles]
   *    paramaters:
   *      - in: path
   *        name: id
   *        schema:
   *          type: string
   *        required: true
   *        description: The Article Id
   *    responses:
   *      200:
   *        description: The Article with the specified Id
   *        content:
   *          application/json:
   *            schema:
   *              $ref: ''
   *      404:
   *        description: No article found
   *        content:
   *          application/json:
   *            example:
   *              error: "No article found"
   *              status: "error"
   */
  static async apigetArticleById(req, res, next) {
    try {
      const article = await Article.getArticleById(req.params.articleId);

      res.status(200).json({ article, status: "success" });
    } catch (e) {
      res.status(404).json({ error: e.message, status: "error" });
    }
  }

  /**
   * @swagger
   * /articles:
   *  post:
   *    summary: Create a new Article
   *    tags: [Articles]
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            $ref: ''
   *    responses:
   *      201:
   *        description: The Article
   *        content:
   *          application/json:
   *            schema:
   *              $ref: ''
   *      500:
   *        description: Internal Server Error
   *        content:
   *          application/json:
   *            example:
   *              error: "Internal Server Error"
   *              status: "error"
   */
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
      res.status(500).json({ error: e.message, status: "error" });
    }
  }

  /**
   * @swagger
   * /articles/{id}:
   *  put:
   *    summary: Update the Article by Id
   *    tags: [Articles]
   *    paramaters:
   *      - in: path
   *        name: id
   *        schema:
   *          type: string
   *        required: true
   *        description: The Article Id
   *    responses:
   *      201:
   *        description: Updated successfully
   *        content:
   *          application/json:
   *            schema:
   *              $ref: ''
   *      404:
   *        description: No article found
   *        content:
   *          application/json:
   *            example:
   *              error: "No article found"
   *              status: "error"
   *      500:
   *        description: Internal Server Error
   *        content:
   *          application/json:
   *            example:
   *              error: "Internal Server Error"
   *              status: "error"
   */
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

  /**
   * @swagger
   * /articles/{id}:
   *  delete:
   *    summary: Delete the Article by Id
   *    tags: [Articles]
   *    paramaters:
   *      - in: path
   *        name: id
   *        schema:
   *          type: string
   *        required: true
   *        description: The Article Id
   *    responses:
   *      200:
   *        description: Deleted successfully
   *        content:
   *          application/json:
   *            schema:
   *              $ref: ''
   *      404:
   *        description: No article found
   *        content:
   *          application/json:
   *            example:
   *              error: "No article found"
   *              status: "error"
   *      500:
   *        description: Internal Server Error
   *        content:
   *          application/json:
   *            example:
   *              error: "Internal Server Error"
   *              status: "error"
   */
  static async apiDeleteArticle(req, res, next) {
    try {
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
