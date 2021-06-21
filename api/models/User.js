import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      // validate: (value) => {
      //   if (validator.isEmail(value)) {
      //     console.log(value, "Invalid Email address");
      //     throw new Error("Invalid Email address");
      //   }
      // },
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
    },
    givenName: {
      type: String,
      required: true,
    },
    familyName: {
      type: String,
      required: true,
    },
    birthDate: {
      type: Date,
      required: true,
    },
    interests: {
      type: Array,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// virtual field generated post-query, not persisted in db
userSchema.virtual("articles", {
  ref: "Authorship",
  localField: "_id",
  foreignField: "author",
});

userSchema.pre("save", async function (next) {
  // Hash the password before saving the user model
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

userSchema.methods.generateAuthToken = async function () {
  // Generate an auth token for the user
  const token = jwt.sign({ _id: this._id }, process.env.JWT_KEY);
  this.tokens = this.tokens.concat({ token });
  await this.save();
  return token;
};

userSchema.statics.getUsersPop = async function ({
  filters = null,
  page = 1,
  usersPerPage,
} = {}) {
  let query = {};
  if (filters) {
    if (filters.familyName) {
      let regexQuery = new RegExp(`.*${filters.familyName}.*`, "i");
      query.familyName = { $regex: regexQuery };
    }
  }

  const totalUsers = await this.countDocuments(query);
  if (totalUsers < 1) {
    return { users: [], totalUsers: 0 };
  }

  const users = await this.find(query)
    .select("-password -tokens")
    .limit(usersPerPage)
    .skip((page - 1) * usersPerPage)
    .populate({
      path: "articles",
      populate: {
        path: "article",
        select: "_id title",
      },
    });

  if (!users) {
    return { users: [], totalUsers };
  }

  return { users, totalUsers };
};

userSchema.statics.findByCredentials = async (email, password) => {
  // Search for a user by email and password
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid login credentials");
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    console.log("model: Invalid login credentials");
    throw new Error("Invalid login credentials");
  }
  return user;
};

userSchema.statics.getUserByIdPop = async function (id) {
  const user = await this.findOne({ _id: id }, "-password -tokens").populate({
    path: "articles",
    populate: {
      path: "article",
      populate: {
        path: "categories",
        populate: {
          path: "mainCategory",
        },
      },
    },
  });
  if (!user) {
    throw new Error(`No user found with Id: ${id}`);
  }
  return user;
};

const User = mongoose.model("User", userSchema);

export default User;
