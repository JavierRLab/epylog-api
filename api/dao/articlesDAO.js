import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;

let articles;

export default class articlesDAO {
  static async injectDB(conn) {
    if (articles) {
      return;
    }
    try {
      articles = await conn.db(process.env.EPYLOG_NS).collection("articles");
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in articlesDAO: ${e}`
      );
    }
  }

  static async getArticles({
    filters = null,
    page = 0,
    articlesPerPage = 10,
  } = {}) {
    let query;
    if (filters) {
      if ("title" in filters) {
        let regexQuery = new RegExp(`.*${filters["title"]}.*`, "i");
        query = { title: { $regex: regexQuery } };
      } else if ("ISCED" in filters) {
        let regexQuery = new RegExp(`.*${filters["ISCED"]}.*`, "i");
        query = { title: { $regex: regexQuery } };
      }
    }

    let cursor;

    try {
      cursor = await articles.find(query);
    } catch (e) {
      console.error(`Unable to issue find command: ${e}`);
      return {
        articlesList: [],
        totalNumArticles: 0,
      };
    }

    const displayCursor = cursor
      .limit(articlesPerPage)
      .skip(articlesPerPage * page);

    try {
      const articlesList = await displayCursor.toArray();
      const totalNumArticles = await articles.countDocuments(query);

      return { articlesList: articlesList, totalNumArticles: totalNumArticles };
    } catch (e) {
      console.error(
        `Unable to convert cursor to array or problem counting documents: ${e}`
      );
      return { articlesList: [], totalNumArticles: 0 };
    }
  }

  static async getArticleById(articleId) {
    try {
      const articleResponse = await articles.findOne({
        _id: ObjectId(articleId),
      });
      return articleResponse;
    } catch (e) {
      console.error(`Unable to issue find command: ${e}`);
      return { error: e };
    }
  }

  static async addArticle(
    title,
    description,
    categoryIds,
    ISCED,
    publishDate,
    content,
    uploadDate
  ) {
    try {
      const articleDoc = {
        title: title,
        description: description,
        category_ids: categoryIds.toObjectId(),
        ISCED: ISCED,
        publishDate: publishDate,
        uploadDate: uploadDate,
        content: content,
      };

      return await articles.insertOne(articleDoc);
    } catch (e) {
      console.error(`Unable to post article: ${e}`);
      return { error: e };
    }
  }

  static async updateArticle(
    articleId,
    title,
    description,
    categoryIds,
    ISCED,
    publishDate,
    content,
    uploadDate
  ) {
    try {
      const articleDoc = {
        title: title,
        description: description,
        category_ids: categoryIds.toObjectId,
        ISCED: ISCED,
        publishDate: publishDate,
        uploadDate: uploadDate,
        content: content,
      };
      const updateResponse = await articles.updateOne(
        { _id: ObjectId(articleId) },
        { $set: articleDoc }
      );

      return updateResponse;
    } catch (e) {
      console.error(`Unable to update article: ${e}`);
      return { error: e };
    }
  }

  static async deleteArticleById(articleId) {
    try {
      const deleteResponse = await articles.deleteOne({
        _id: ObjectId(articleId),
      });
      return deleteResponse;
    } catch (e) {
      console.error(`Unable to delete article: ${e}`);
      return { error: e };
    }
  }
}

//transforma String o Array a ObjectId
function toObjectId() {
  let result = null;
  try {
    if (Array.isArray(this)) {
      result = this.map((id) => ObjectId(id));
    } else if (typeof this == "string") {
      ObjectId(result);
    }

    return result;
  } catch (e) {
    console.error(`Unable to convert to ObjectId: ${this}`);
  }
}

// mongo "mongodb+srv://cluster0epylog.t21tf.mongodb.net/myFirstDatabase" --username admin

// db.articles.updateMany(
//   {_id: ObjectId('609c267b77a05dde8206ca5a')},
//   {
//     $set: {
//       uploadDate: new Date(),
//     },
//   }
// );
