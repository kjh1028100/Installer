import express from "express";
import {
  GithubStartLogin,
  GithubFinishLogin,
  KakaoStartLogin,
  KakaoFinishLogin,
} from "../controllers/userControllers";
import { publicMiddleware } from "../middleware";
const userRouter = express.Router();

// social login
userRouter.get("/github/start", publicMiddleware, GithubStartLogin);
userRouter.get("/github/finish", GithubFinishLogin);
userRouter.get("/kakao/start", publicMiddleware, KakaoStartLogin);
userRouter.get("/kakao/finish", KakaoFinishLogin);
// edit page

export default userRouter;
