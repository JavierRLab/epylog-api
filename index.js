import app from "./app.js";
import mongodb from "mongodb";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const MongoClient = mongodb.MongoClient;

const port = process.env.PORT || 8000;

if (!process.env.EPYLOG_DB_URI) {
  throw new Error("EPYLOG_DB_URI is not in the environmental variables.");
}

// mongo "mongodb+srv://cluster0epylog.t21tf.mongodb.net/myFirstDatabase" --username admin
mongoose.connection.on("error", () => {
  console.log("Error connecting to MongoDb. Check EPYLOG_DB_URI in .env");
  process.exit(1);
});
mongoose.connection.on("connected", () => {
  console.log("Success: connected to MongoDb mongoose!");
});
mongoose
  .connect(process.env.EPYLOG_DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((err) => {
    console.error(err.stack);
    process.exit(1);
  })
  .then(async (client) => {
    app.listen(port, () => {
      console.log(`listening on port: ${port}`);
    });
  });
