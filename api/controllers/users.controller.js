import User from "../models/User.js";

export default class UserController {
  static async apiGetUser(req, res, next) {
    res.status(200).send(req.user);
  }

  static async apiPostUser(req, res, next) {
    // Create a new user
    try {
      const user = new User(req.body);
      await user.save();
      const token = await user.generateAuthToken();
      res.status(201).send({ user, token });
    } catch (e) {
      res.status(400).send(e);
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
          .send({ error: "Login failed! Check authentication credentials" });
      }
      const token = await user.generateAuthToken();
      res.send({ user, token });
    } catch (e) {
      console.log(e);
      res.status(400).json({ errorNo: 400, msg: e.message });
    }
  }

  static async apiLogOutUser(req, res, next) {
    // Log user out of the application
    try {
      req.user.tokens = req.user.tokens.filter((token) => {
        return token.token != req.token;
      });

      await req.user.save();
      res.status(200).send({
        success: true,
      });
    } catch (e) {
      res.status(500).send(e);
    }
  }

  static async apiLogOutAll(req, res, next) {
    // Log user out of all devices
    try {
      req.user.tokens.splice(0, req.user.tokens.length);
      await req.user.save();
      res.status(200).send({
        success: true,
      });
    } catch (e) {
      res.status(500).send(e);
    }
  }
}
