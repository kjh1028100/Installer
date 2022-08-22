// router 짜고
// 저장 버튼 클릭
// 이미지 db에 자동으로 저장
// 사각형,원 정보 저장
// 이미지 저장해도 수정을 어떻게 할지 고민
import express from "express";
import {
  getInterior,
  getInteriorCreate,
  putInteriorEdit,
  getSeeInstaller,
  deleteInstaller,
} from "../controllers/installerController";
import { protectedMiddleware } from "../middleware";

const installerRouter = express.Router();

installerRouter.get("/", protectedMiddleware, getInterior);

installerRouter
  .route("/create")
  .all(protectedMiddleware)
  .get(getInteriorCreate);

installerRouter
  .route("/:id([a-z\\d+]{24})/edit")
  .all(protectedMiddleware)
  .get(getInteriorCreate);

installerRouter.get("/:id([a-z\\d+]{24})", getSeeInstaller);
installerRouter.get("/delete-installer", protectedMiddleware, deleteInstaller);
export default installerRouter;
