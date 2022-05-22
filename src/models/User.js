import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  id: { type: String, trim: true, required: true, maxlength: 10 },
  email: { type: String, trim: true, required: true },
  username: { type: String, trim: true, required: true },
  password: { type: String, trim: true },
  avatarUrl: { type: String, trim: true },
  socialOnly: { type: Boolean, trime: true },
});

// 1.암호화
userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 5);
});

const User = mongoose.model("User", userSchema);

export default User;
