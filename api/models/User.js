import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = mongoose.Schema({
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
});

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

const User = mongoose.model("User", userSchema);

export default User;
