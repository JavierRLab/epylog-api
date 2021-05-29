const Schema = require("mongoose");

const Schema = mongoose.Schema;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    ISCEDmin: {
      type: Number,
      required: true,
      unique: true,
      trim: true,
      minlength: 1,
    },
  },
  {
    timestamps: true,
  }
);

const Category = Schema.mongoose.model("Category", categorySchema);
