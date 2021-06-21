import User from "../models/User.js";

/**
 * @swagger
 * tags:
 *  name: Users
 *  description: The Users of the API
 * components:
 *  securitySchemes:
 *    BearerAuth:
 *      type: http
 *      scheme: bearer
 *  schemas:
 *    User:
 *      type: object
 *      properties:
 *        _id:
 *          type: String
 *          description: Auto-generated Id
 *        email:
 *          type: String
 *        password:
 *          type: String
 *        givenName:
 *          type: String
 *        familyName:
 *          type: String
 *        birthDate:
 *          type: Date
 *        interests:
 *          type: Array
 *          description: Array of mixed ISCED and category Ids
 *        description:
 *          type: String
 *        token:
 *          type: String
 *          description: Auto-generated auth token
 *      required:
 *        - email
 *        - password
 *        - givenName
 *        - familyName
 *        - birthDate
 */

export default class UserController {
  /**
   * @swagger
   * /users:
   *  get:
   *    summary: Returns a filtered list of Users
   *    tags: [Users]
   *    parameters:
   *      - in: query
   *        name: familyName
   *        schema:
   *          type: String
   *        description: The familyName to Search for Users
   *      - in: query
   *        name: page
   *        schema:
   *          type: Integer
   *          min: 1
   *          default: 1
   *        description: The starting page of the Search
   *      - in: query
   *        name: usersPerPage
   *        schema:
   *          type: Integer
   *        min: 1
   *        default: 10
   *        description: The Users per page of the Search
   *    responses:
   *      200:
   *        description: The list of the Users and pagination data
   *        content:
   *          application/json:
   *            schema:
   *              $ref: ''
   *            example:
   *              data:
   *                users: [{},{}]
   *                filters: { familyName: "stronger" }
   *                page: 1
   *                usersPerPage: 2
   *                totalPages: 6
   *                totalUsers: 11
   *              status: "success"
   *      400:
   *        description: Error in pagination
   *        content:
   *          application/json:
   *            example:
   *              error: "Error in pagination"
   *              status: "error"
   *      404:
   *        description: No users found
   *        content:
   *          application/json:
   *            example:
   *              error: "No users found"
   *              status: "error"
   *      500:
   *        description: Internal Server Error
   *        content:
   *          application/json:
   *            example:
   *              error: "Internal Server Error"
   *              status: "error"
   */
  static async apiGetUsers(req, res, next) {
    const page = req.query.page ? parseInt(req.query.page, 10) : 1;
    const usersPerPage = req.query.usersPerPage
      ? parseInt(req.query.usersPerPage, 10)
      : 10;
    let filters = {};
    if (req.query.familyName) filters.familyName = req.query.familyName;

    try {
      const { users, totalUsers } = await User.getUsersPop({
        filters,
        page,
        usersPerPage,
      });

      if (totalUsers == 0) {
        return res
          .status(404)
          .json({ error: "No users found", status: "error" });
      } else if (totalUsers > 0 && users.length == 0) {
        return res.status(400).json({
          error: "Error in pagination",
          totalUsers,
          status: "error",
        });
      }

      let data = {
        users,
        filters,
        page,
        usersPerPage,
        totalPages: Math.ceil(totalUsers / usersPerPage),
        totalUsers,
      };

      res.json({ data, status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message, status: "error" });
    }
  }
  /**
   * @swagger
   * /users:
   *  post:
   *    summary: Create a new User and generates a token
   *    tags: [Users]
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            $ref: "#/components/schemas/User"
   *    responses:
   *      201:
   *        description: The created User
   *        content:
   *          application/json:
   *            schema:
   *              $ref: "#/components/schemas/User"
   *      500:
   *        description: Internal Server Error
   *        content:
   *          application/json:
   *            example:
   *              error: "Internal Server Error"
   *              status: "error"
   */
  static async apiPostUser(req, res, next) {
    // Create a new user
    try {
      const user = new User(req.body);
      await user.save();
      const token = await user.generateAuthToken();
      res.status(201).json({ user, token, status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message, status: "error" });
    }
  }

  /**
   * @swagger
   * /users/login:
   *  post:
   *    summary: Log an existing User and generates a token
   *    tags: [Users]
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            properties:
   *              email:
   *                type: String
   *              password:
   *                type: String
   *    responses:
   *      201:
   *        description: The loged User
   *        content:
   *          application/json:
   *            schema:
   *              $ref: "#/components/schemas/User"
   *      401:
   *        description: Login failed
   *        content:
   *          application/json:
   *            example:
   *              error: "Login failed! Check authentication credentials"
   *              status: "error"
   *      500:
   *        description: Internal Server Error
   *        content:
   *          application/json:
   *            example:
   *              error: "Internal Server Error"
   *              status: "error"
   */
  static async apiLoginUser(req, res, next) {
    // Login a registered user
    try {
      const { email, password } = req.body;
      const user = await User.findByCredentials(email, password);
      if (!user) {
        return res.status(401).json({
          error: "Login failed! Check authentication credentials",
          status: "error",
        });
      }
      const token = await user.generateAuthToken();
      res.status(201).json({ user, token, status: "success" });
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: e.message, status: "error" });
    }
  }

  /**
   * @swagger
   * /users/me:
   *  get:
   *    summary: Return the loged User
   *    tags: [Users]
   *    security:
   *      - BearerAuth: []
   *    responses:
   *      200:
   *        description: The loged User
   *        content:
   *          application/json:
   *            schema:
   *              $ref: "#/components/schemas/User"
   */
  static async apiGetSelfUser(req, res, next) {
    try {
      const user = req.user.select("-password -tokens");
      res.status(200).json({ user, status: "success" });
    } catch (e) {
      res.status(404).json({ error: e.message, status: "error" });
    }
  }

  /**
   * @swagger
   * /users/me:
   *  put:
   *    summary: Update the loged User
   *    tags: [Users]
   *    security:
   *      - BearerAuth: []
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            $ref: "#/components/schemas/User"
   *    responses:
   *      201:
   *        description: Updated successfully
   *        content:
   *          application/json:
   *            schema:
   *              $ref: "#/components/schemas/User"
   *      401:
   *        description: Login failed
   *        content:
   *          application/json:
   *            example:
   *              error: "Login failed! Check authentication credentials"
   *              status: "error"
   *      500:
   *        description: Internal Server Error
   *        content:
   *          application/json:
   *            example:
   *              error: "Internal Server Error"
   *              status: "error"
   */
  static async apiUpdateUser(req, res, next) {
    try {
      const user = req.user;
      const {
        email,
        password,
        givenName,
        familyName,
        birthDate,
        interests,
        description,
      } = req.body;

      if (email) user.email = email;
      if (password) user.password = password;
      if (givenName) user.givenName = givenName;
      if (familyName) user.familyName = familyName;
      if (birthDate) user.birthDate = birthDate;
      if (interests) user.interests = interests;
      if (description) user.description = description;

      await user.save();

      res.status(201).json({ user, status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message, status: "error" });
    }
  }

  /**
   * @swagger
   * /users/{id}:
   *  get:
   *    summary: Get the User by Id
   *    tags: [Users]
   *    parameters:
   *      - in: path
   *        name: id
   *        schema:
   *          type: string
   *        required: true
   *        description: The User Id
   *    responses:
   *      200:
   *        description: The User with the specified Id
   *        content:
   *          application/json:
   *            schema:
   *              $ref: "#/components/schemas/User"
   *      404:
   *        description: No user found
   *        content:
   *          application/json:
   *            example:
   *              error: "No user found"
   *              status: "error"
   */
  static async apiGetUser(req, res, next) {
    try {
      const user = await User.getUserByIdPop(req.params.userId);

      res.status(200).json({ user, status: "success" });
    } catch (e) {
      res.status(404).json({ error: e.message, status: "error" });
    }
  }

  /**
   * @swagger
   * /users/me/logout:
   *  post:
   *    summary: Log out the User and clear the current token
   *    tags: [Users]
   *    security:
   *      - BearerAuth: []
   *    responses:
   *      200:
   *        description: Loged out successfully
   *        content:
   *          application/json:
   *            example:
   *              status: success
   *      401:
   *        description: Login failed
   *        content:
   *          application/json:
   *            example:
   *              error: "Login failed! Check authentication credentials"
   *              status: "error"
   *      500:
   *        description: Internal Server Error
   *        content:
   *          application/json:
   *            example:
   *              error: "Internal Server Error"
   *              status: "error"
   */
  static async apiLogOutUser(req, res, next) {
    // Log user out of the application
    try {
      req.user.tokens = req.user.tokens.filter((token) => {
        return token.token != req.token;
      });

      await req.user.save();
      res.status(200).json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message, status: "error" });
    }
  }

  /**
   * @swagger
   * /users/me/logoutall:
   *  post:
   *    summary: Log out the User and clear all existing tokens
   *    tags: [Users]
   *    security:
   *      - BearerAuth: []
   *    responses:
   *      200:
   *        description: Loged out successfully
   *        content:
   *          application/json:
   *            example:
   *              status: success
   *      401:
   *        description: Login failed
   *        content:
   *          application/json:
   *            example:
   *              error: "Login failed! Check authentication credentials"
   *              status: "error"
   *      500:
   *        description: Internal Server Error
   *        content:
   *          application/json:
   *            example:
   *              error: "Internal Server Error"
   *              status: "error"
   */
  static async apiLogOutAll(req, res, next) {
    // Log user out of all devices
    try {
      req.user.tokens.splice(0, req.user.tokens.length);
      await req.user.save();
      res.status(200).json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message, status: "error" });
    }
  }
}
