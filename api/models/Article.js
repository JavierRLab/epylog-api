import mongoose from "mongoose";

const articleSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    categories: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Category",
        },
      ],
      required: true,
    },
    ISCED: {
      type: Number,
      min: 0,
      max: 8,
      required: true,
    },
    publishDate: {
      type: Date,
      required: true,
    },
    uploadDate: {
      type: Date,
      required: false,
      default: Date.now,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// virtual field generated post-query, not persisted in db
articleSchema.virtual("authors", {
  ref: "Authorship",
  localField: "_id",
  foreignField: "article",
});

articleSchema.statics.getArticles = async function ({
  filters = null,
  page = 1,
  articlesPerPage = 10,
} = {}) {
  let query;
  if (filters) {
    if ("title" in filters) {
      let regexQuery = new RegExp(`.*${filters["title"]}.*`, "i");
      query = { title: { $regex: regexQuery } };
    } /* else {
      // to-do: other filters
    } */
  }

  const totalArticles = await this.countDocuments(query);

  // if no articles found early return empty list
  if (totalArticles < 1) {
    return { articles: [], totalArticles: 0 };
  }
  const articles = await this.find(query)
    .limit(articlesPerPage)
    .skip((page - 1) * articlesPerPage)
    .populate({
      path: "categories",
      populate: {
        path: "mainCategory",
      },
    })
    .populate({
      path: "authors",
      populate: {
        path: "author",
        select: "-password -tokens",
      },
    });

  // if unable to complete query, return empty list with real article count
  // (wrong pagination probably)
  if (!articles) {
    return { articles: [], totalArticles };
  }
  // consistent Array if only 1 article found
  return { articles, totalArticles };
};

articleSchema.statics.getArticleById = async function (id) {
  const article = await this.findOne({ _id: id })
    .populate({
      path: "categories",
      populate: {
        path: "mainCategory",
      },
    })
    .populate({
      path: "authors",
      populate: {
        path: "author",
        select: "-password -tokens",
      },
    });
  if (!article) {
    throw new Error(`No article found with Id: ${id}`);
  }
  return article;
};

const Article = mongoose.model("Article", articleSchema);

export default Article;
