import app from "./app.js";
import mongodb from "mongodb";
import dotenv from "dotenv";
import ArticlesDAO from "./api/dao/articlesDAO.js";
import CategoriesDAO from "./api/dao/categoriesDAO.js";

dotenv.config();
const MongoClient = mongodb.MongoClient;

const port = process.env.PORT || 8000;

MongoClient.connect(process.env.EPYLOG_DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .catch((err) => {
    console.error(err.stack);
    process.exit(1);
  })
  .then(async (client) => {
    await ArticlesDAO.injectDB(client);
    await CategoriesDAO.injectDB(client);
    app.listen(port, () => {
      console.log(`listening on port: ${port}`);
    });
  });
