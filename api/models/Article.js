import mongoose, { Schema } from "mongoose";
import Category from "../models/Category";

const articleSchema = mongoose.Schema({
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
    required: true,
  },
  publishDate: {
    type: Date,
    required: true,
  },
  uploadDate: {
    type: Date,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

const Article = mongoose.model("Article", articleSchema);

export default Article;
