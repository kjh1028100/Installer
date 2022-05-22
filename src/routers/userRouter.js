import express from "express";
import {
  GithubStartLogin,
  GithubFinishLogin,
  KakaoStartLogin,
  KakaoFinishLogin,
} from "../controllers/userControllers";
const userRouter = express.Router();

// social login
userRouter.get("/github/start", GithubStartLogin);
userRouter.get("/github/finish", GithubFinishLogin);
userRouter.get("/kakao/start", KakaoStartLogin);
userRouter.get("/kakao/finish", KakaoFinishLogin);
// edit page

export default userRouter;
