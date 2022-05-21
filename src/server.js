import express from "express";
import morgan from "morgan";

const app = express();
const PORT = 6000;
const logger = morgan("dev");

app.use(logger);

const handleListen = () => {
  console.log(`🚀 http://localhost:${PORT}`);
};

app.listen(PORT, handleListen);
