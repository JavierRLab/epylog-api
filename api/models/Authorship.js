import mongoose from "mongoose";

const authorshipSchema = mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    article: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Article",
      required: true,
    },
  },
  { timestamps: true }
);

authorshipSchema.index({ author: 1, article: 1 }, { unique: true });

authorshipSchema.statics.getArticlesByAuthorId = async function (authorId) {
  const data = await this.find({ author: authorId });
  if (!data) {
    throw new Error(`No articles found with authorId: ${authorId}`);
  }
  return data;
};

authorshipSchema.statics.getAuthorsByArticleId = async function (articleId) {
  const data = await this.find({ article: articleId });
  if (!data) {
    throw new Error(`No articles found with articleId: ${articleId}`);
  }
  return data;
};

const User = mongoose.model("Authorship", authorshipSchema);

export default User;
