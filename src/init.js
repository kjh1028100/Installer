import app from "./server";

const PORT = 5555;

const handleListen = () => {
  console.log(`http://localhost:${PORT} 🚀`);
};

app.listen(PORT, handleListen);
