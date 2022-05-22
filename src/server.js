import "./db";
import "./models/User";
import express from "express";
// import session from "express-session";
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

// app.use(session({
//     // secret:
// }));
app.use(localsMiddlware);
app.use("/", rootRouter);
// app.use("/users",)

export default app;
