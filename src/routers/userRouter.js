import express from "express";
import {
  GithubStartLogin,
  GithubFinishLogin,
} from "../controllers/userControllers";
const userRouter = express.Router();

// social login
userRouter.get("/github/start", GithubStartLogin);
userRouter.get("/github/finish", GithubFinishLogin);
// edit page

export default userRouter;
