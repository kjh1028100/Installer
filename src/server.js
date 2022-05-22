import "dotenv/config";
import "./db";
import "./models/User";
import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import morgan from "morgan";
import { localsMiddlware } from "./middleware";
import rootRouter from "./routers/rootRouter";

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(logger);

app.use(
  session({
    secret: process.env.SESSION_TXT,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
  })
);

app.use(localsMiddlware);
app.use("/", rootRouter);
// app.use("/users",)

export default app;
