import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;

let users;

export default class usersDAO {
  static async injectDB(conn) {
    if (users) {
      return;
    }
    try {
      users = await conn.db(process.env.EPYLOG_NS).collection("users");
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in usersDAO: ${e}`
      );
    }
  }

  static async getUsers({ filters = null, page = 0, usersPerPage = 10 } = {}) {
    let query;
    if (filters) {
      if ("familyName" in filters) {
        let regexQuery = new RegExp(`.*${filters["familyName"]}.*`, "i");
        query = { familyName: { $regex: regexQuery } };
      }
    }

    let cursor;

    try {
      console.log(`get query: ${query}`);
      cursor = await users.find(query);
    } catch (e) {
      console.error(`Unable to issue find command: ${e}`);
      return {
        usersList: [],
        totalNumUsers: 0,
      };
    }

    const displayCursor = cursor.limit(usersPerPage).skip(usersPerPage * page);

    try {
      const usersList = await displayCursor.toArray();
      const totalNumUsers = await users.countDocuments(query);

      return { usersList: usersList, totalNumUsers: totalNumUsers };
    } catch (e) {
      console.error(
        `Unable to convert cursor to array or problem counting documents: ${e}`
      );
      return { usersList: [], totalNumUsers: 0 };
    }
  }

  static async getUserById(articleId) {
    try {
      const userResponse = await users.findOne({
        _id: ObjectId(articleId),
      });
      return userResponse;
    } catch (e) {
      console.error(`Unable to issue find command: ${e}`);
      return { error: e };
    }
  }

  static async addUser(
    email,
    password,
    givenName,
    familyName,
    birthDate,
    interests,
    description,
    tokens
  ) {
    try {
      if (validator.isEmail(email)) {
        console.log(email, "Invalid Email address");
        throw new Error("Invalid Email address");
      }

      const userDoc = {};

      return await users.insertOne(userDoc);
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
      const updateResponse = await users.updateOne(
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
      const deleteResponse = await users.deleteOne({
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
