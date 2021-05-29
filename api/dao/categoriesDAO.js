import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;

let categories;

export default class categoriesDAO {
  static async injectDB(conn) {
    if (categories) {
      return;
    }
    try {
      categories = await conn
        .db(process.env.EPYLOG_NS)
        .collection("categories");
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in categoriesDAO: ${e}`
      );
    }
  }

  static async getCategories() {
    let cursor;
    try {
      cursor = await categories.find({});
    } catch (e) {
      console.error(`Unable to issue find command: ${e}`);
      return { categoryList: [] };
    }

    try {
      const categoryList = await cursor.toArray();
      console.log(categoryList);
      return { categoryList: categoryList };
    } catch (e) {
      console.error(`Unable to convert cursor to array: ${e}`);
      return { categoryList: [] };
    }
  }

  static async addCategory(name, mainCategory) {
    try {
      const categoryDoc = {
        name: name,
        mainCategory: ObjectId(mainCategory),
      };

      return await categories.insertOne(categoryDoc);
    } catch (e) {
      console.error(`Unable to post category: ${e}`);
      return { error: e };
    }
  }

  static async updateCategory(categoryId, name, mainCategory) {
    try {
      const categoryDoc = {
        name: name,
        mainCategory: ObjectId(mainCategory),
      };

      const updateResponse = await categories.updateOne(
        { _id: ObjectId(categoryId) },
        { $set: categoryDoc }
      );

      return updateResponse;
    } catch (e) {
      console.error(`Unable to update category: ${e}`);
      return { error: e };
    }
  }

  static async deleteCategoryById(categoryId) {
    try {
      const deleteResponse = await categories.deleteOne({
        _id: ObjectId(categoryId),
      });

      return deleteResponse;
    } catch (e) {
      console.error(`Unable to delete category: ${e}`);
      return { error: e };
    }
  }
}
