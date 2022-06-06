import express from "express";
import { protectedMiddleware } from "../middleware";
import { postCreateInterior } from "../controllers/installerController";

const apiRouter = express.Router();

apiRouter.post("interior/:id([a-z\\+d]{24})/save", postCreateInterior);

export default apiRouter;
