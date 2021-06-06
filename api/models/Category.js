import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  mainCategory: {
    // If this field is not declared, the category is a MainCategory itself
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: false,
  },
});

categorySchema.index({ name: 1, mainCategory: 1 }, { unique: true });

categorySchema.statics.getCategoryById = async function (id) {
  const category = await this.findOne({ _id: id }).populate("mainCategory");
  if (!category) {
    throw new Error(`No category found with Id: ${id}`);
  }
  return category;
};

categorySchema.statics.getSubCategoriesByMainId = async function (mainId) {
  const categories = await this.find({ mainCategory: mainId });
  if (!categories) {
    throw new Error(`No subcategory found with mainId: ${mainId}`);
  }
  return categories;
};

categorySchema.statics.getMainCategories = async function () {
  // Search for categories with no mainCategory declared
  const categories = await this.find({ mainCategory: { $exists: false } });
  if (!categories) {
    throw new Error("No main category found");
  }
  return categories;
};

categorySchema.statics.getAllCategories = async function () {
  const categories = await this.find().populate("mainCategory");
  if (!categories) {
    throw new Error("No category found");
  }
  return categories;
};

const Category = mongoose.model("Category", categorySchema);

export default Category;
