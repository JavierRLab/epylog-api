const Schema = require("mongoose");

const Schema = mongoose.Schema;

const articleSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    arCategories: { type: Array, required: true },
    ISCED: { type: Number, required: true },
    publishDate: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

const Article = Schema.mongoose.model("Article", articleSchema);
