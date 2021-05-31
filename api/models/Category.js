import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  mainCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: false,
  },
});

const Category = mongoose.model("Category", categorySchema);

export default Category;
