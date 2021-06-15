import jwt from "jsonwebtoken";
import User from "../models/User.js";

const auth = async (req, res, next) => {
  try {
    let token = req.header("Authorization");
    if (!token) {
      return res
        .status(401)
        .json({ error: "auth: Invalid login credentials", status: "error" });
    }
    token = token.replace("Bearer ", "");
    const data = jwt.verify(token, process.env.JWT_KEY);
    const user = await User.findOne({
      _id: data._id,
      "tokens.token": token,
    });
    if (!user) {
      return res
        .status(401)
        .json({ error: "auth: Invalid login credentials", status: "error" });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e.message, status: "error" });
  }
};

export default auth;
