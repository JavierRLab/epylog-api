import express from "express";
import cors from "cors";
import articles from "./api/routes/articles.route.js";
import categories from "./api/routes/categories.route.js";
import users from "./api/routes/users.route.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/articles", articles);
app.use("/api/v1/categories", categories);
app.use("/api/v1/users", users);
app.use("*", (req, res) => {
  res.status(404).json({ errorNo: 404, msg: "not found" });
});

export default app;
