import Category from "../models/Category.js";

/**
 * @swagger
 * tags:
 *  name: Categories
 *  description: The Categories of the Articles managed by the API
 * components:
 *  schemas:
 *    Category:
 *      type: object
 *      properties:
 *        _id:
 *          type: String
 *          description: Auto-generated Id
 *        name:
 *          type: String
 *        mainCategory:
 *          type: String
 *          description: The Id of the father Category
 *      required:
 *        - name
 */

export default class CategoryController {
  /**
   * @swagger
   * /categories:
   *  get:
   *    summary: Returns the list of all Categories
   *    tags: [Categories]
   *    responses:
   *      200:
   *        description: The list of all Categories
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                categories:
   *                  type: array
   *                  items:
   *                    $ref: "#/components/schemas/Category"
   *            example:
   *              categories: [{},{}]
   *              status: "success"
   *      404:
   *        description: No category found
   *        content:
   *          application/json:
   *            example:
   *              error: "No category found"
   *              status: "error"
   */
  static async apiGetCategories(req, res, next) {
    try {
      const categories = await Category.getAllCategories();
      res.status(200).json({ categories, status: "success" });
    } catch (e) {
      res.status(404).json({ error: e.message, status: "error" });
    }
  }

  /**
   * @swagger
   * /categories:
   *  post:
   *    summary: Create a new Category
   *    tags: [Categories]
   *    security:
   *      - BearerAuth: []
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            $ref: "#/components/schemas/Category"
   *    responses:
   *      201:
   *        description: The created Category
   *        content:
   *          application/json:
   *            schema:
   *              $ref: "#/components/schemas/Category"
   *      500:
   *        description: Internal Server Error
   *        content:
   *          application/json:
   *            example:
   *              error: "Internal Server Error"
   *              status: "error"
   */
  static async apiPostCategory(req, res, next) {
    try {
      const category = new Category(req.body);
      await category.save();

      res.status(201).json({ category, status: "success" });
    } catch (e) {
      res.status(400).json({ error: e.message, status: "error" });
    }
  }

  /**
   * @swagger
   * /categories/maincategories:
   *  get:
   *    summary: Returns the list of all Main Categories
   *    tags: [Categories]
   *    responses:
   *      200:
   *        description: The list of all Main Categories
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                categories:
   *                  type: array
   *                  items:
   *                    $ref: "#/components/schemas/Category"
   *            example:
   *              categories: [{},{}]
   *              status: "success"
   *      404:
   *        description: No category found
   *        content:
   *          application/json:
   *            example:
   *              error: "No category found"
   *              status: "error"
   */
  static async apiGetMainCategories(req, res, next) {
    try {
      const categories = await Category.getMainCategories();
      res.status(200).json({ categories, status: "success" });
    } catch (e) {
      res.status(404).json({ error: e.message, status: "error" });
    }
  }

  /**
   * @swagger
   * /categories/{id}:
   *  get:
   *    summary: Get the Category by Id
   *    tags: [Categories]
   *    parameters:
   *      - in: path
   *        name: id
   *        schema:
   *          type: string
   *        required: true
   *        description: The Category Id
   *    responses:
   *      200:
   *        description: The Category with the specified Id
   *        content:
   *          application/json:
   *            schema:
   *              $ref: "#/components/schemas/Category"
   *      404:
   *        description: No Category found
   *        content:
   *          application/json:
   *            example:
   *              error: "No Category found"
   *              status: "error"
   */
  static async apiGetCategory(req, res, next) {
    try {
      const category = await Category.getCategoryById(req.params.categoryId);
      res.status(200).json({ category, status: "success" });
    } catch (e) {
      res.status(404).json({ error: e.message, status: "error" });
    }
  }

  /**
   * @swagger
   * /categories/{id}:
   *  put:
   *    summary: Update the Category by Id
   *    tags: [Categories]
   *    security:
   *      - BearerAuth: []
   *    parameters:
   *      - in: path
   *        name: id
   *        schema:
   *          type: string
   *        required: true
   *        description: The Category Id
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            $ref: "#/components/schemas/Category"
   *    responses:
   *      201:
   *        description: The created Category
   *        content:
   *          application/json:
   *            schema:
   *              $ref: "#/components/schemas/Category"
   *      404:
   *        description: No Category found
   *        content:
   *          application/json:
   *            example:
   *              error: "No Category found"
   *              status: "error"
   *      500:
   *        description: Internal Server Error
   *        content:
   *          application/json:
   *            example:
   *              error: "Internal Server Error"
   *              status: "error"
   */
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
      res.status(201).json({ category, status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message, status: "error" });
    }
  }

  /**
   * @swagger
   * /categories/{id}:
   *  delete:
   *    summary: Delete the Category by Id
   *    tags: [Categories]
   *    security:
   *      - BearerAuth: []
   *    parameters:
   *      - in: path
   *        name: id
   *        schema:
   *          type: string
   *        required: true
   *        description: The Category Id
   *    responses:
   *      200:
   *        description: Deleted successfully
   *        content:
   *          application/json:
   *            schema:
   *              $ref: "#/components/schemas/Category"
   *      404:
   *        description: No Category found
   *        content:
   *          application/json:
   *            example:
   *              error: "No Category found"
   *              status: "error"
   *      500:
   *        description: Internal Server Error
   *        content:
   *          application/json:
   *            example:
   *              error: "Internal Server Error"
   *              status: "error"
   */
  static async apiDeleteCategory(req, res, next) {
    try {
      const category = await Category.findByIdAndDelete(req.params.categoryId);

      if (!category) {
        return res.status(404).json({
          error: `No category found with id: ${req.params.categoryId}`,
          status: "error",
        });
      }

      res.json({ data: category, status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message, status: "error" });
    }
  }

  /**
   * @swagger
   * /categories/{id}/subcategories:
   *  get:
   *    summary: Returns the list of all subCategories by the father Id
   *    tags: [Categories]
   *    parameters:
   *      - in: path
   *        name: id
   *        schema:
   *          type: string
   *        required: true
   *        description: The Category Id
   *    responses:
   *      200:
   *        description: The list of all subCategories by the father Id
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                categories:
   *                  type: array
   *                  items:
   *                    $ref: "#/components/schemas/Category"
   *            example:
   *              categories: [{},{}]
   *              status: "success"
   *      404:
   *        description: No category found
   *        content:
   *          application/json:
   *            example:
   *              error: "No category found"
   *              status: "error"
   */
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
}
