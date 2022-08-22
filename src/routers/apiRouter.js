import express from "express";
import {
  postCreateInterior,
  patchRegisterView,
  postMakeComment,
  deleteComment,
  pathEditComment,
  pathRegisterLike,
} from "../controllers/installerController";

const apiRouter = express.Router();

apiRouter.post("/interior/:id([a-z\\d+]{24})/save", postCreateInterior);
apiRouter.patch("/installer/:id([a-z\\d+]{24})/view", patchRegisterView);
apiRouter.patch("/installer/:id([a-z\\d+]{24})/like", pathRegisterLike);
apiRouter.patch("/installer/:id([a-z\\d+]{24})/comment", pathEditComment);
apiRouter.post("/installer/:id([a-z\\d+]{24})/comment", postMakeComment);
apiRouter.delete("/installer/:id([a-z\\d+]{24})/comment", deleteComment);

export default apiRouter;
