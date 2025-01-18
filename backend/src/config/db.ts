import mongoose from "mongoose";
require("dotenv").config();
const dbUrl = process.env.MONGO_URI ?? "localhost:27017";

export const connectDB = async () =>
  mongoose
    .connect(dbUrl)
    .then(() => {
      console.log("database is running");
    })
    .catch((err) => {
      console.log(err);
    });