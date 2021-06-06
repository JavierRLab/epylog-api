import User from "../models/User.js";

export default class UserController {
  static async apiGetUser(req, res, next) {
    res.status(200).json(req.user);
  }

  static async apiPostUser(req, res, next) {
    // Create a new user
    try {
      const user = new User(req.body);
      await user.save();
      const token = await user.generateAuthToken();
      res.status(201).json({ user, token, status: "success" });
    } catch (e) {
      res.status(400).json({ error: e.message, status: "success" });
    }
  }

  static async apiLoginUser(req, res, next) {
    // Login a registered user
    try {
      const { email, password } = req.body;
      const user = await User.findByCredentials(email, password);
      if (!user) {
        return res
          .status(401)
          .json({ error: "Login failed! Check authentication credentials" });
      }
      const token = await user.generateAuthToken();
      res.json({ user, token, status: "success" });
    } catch (e) {
      console.log(e);
      res.status(400).json({ error: e.message, status: "success" });
    }
  }

  static async apiLogOutUser(req, res, next) {
    // Log user out of the application
    try {
      req.user.tokens = req.user.tokens.filter((token) => {
        return token.token != req.token;
      });

      await req.user.save();
      res.status(200).json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message, status: "success" });
    }
  }

  static async apiLogOutAll(req, res, next) {
    // Log user out of all devices
    try {
      req.user.tokens.splice(0, req.user.tokens.length);
      await req.user.save();
      res.status(200).json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message, status: "success" });
    }
  }
}
