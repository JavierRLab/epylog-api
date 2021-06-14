import express from "express";
import cors from "cors";
import articles from "./api/routes/articles.route.js";
import categories from "./api/routes/categories.route.js";
import users from "./api/routes/users.route.js";
import swaggerUI from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

const app = express();

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Epylog API",
      version: "1.0.0",
      description: "A RESTful API for the Epylog App",
    },
    servers: [
      { url: "https://epylog-api.herokuapp.com/api/v1" },
      { url: "http://localhost:5000/api/v1" },
    ],
  },
  apis: ["./api/controllers/*.js"],
};

const specs = swaggerJsdoc(options);

app.use(cors());
app.use(express.json());

app.use("/api/v1/articles", articles);
app.use("/api/v1/categories", categories);
app.use("/api/v1/users", users);
app.use("/api/v1/docs", swaggerUI.serve, swaggerUI.setup(specs));
app.use("/", swaggerUI.serve, swaggerUI.setup(specs));
app.use("*", (req, res) => {
  res.status(404).json({ errorNo: 404, msg: "Route not found" });
});

export default app;
