import express from "express";
import {
  home,
  getJoin,
  postJoin,
  getLogin,
  postLogin,
} from "../controllers/userControllers";
const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.route("/join").get(getJoin).post(postJoin);
rootRouter.route("/login").get(getLogin).post(postLogin);

export default rootRouter;
