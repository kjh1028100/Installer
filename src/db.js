import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/installer");

const db = mongoose.connection;

const handleDbError = (error) => {
  console.log(`❌ DB Error ${error}`);
};

const handleDbOpen = () => {
  console.log(`✅ DB Connection`);
};

db.on("error", handleDbError);
db.once("open", handleDbOpen);
