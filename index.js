import express from "express";
import cors from "cors";
import chatRoutes from "./src/router/chat.route.js"
import dotenv from "dotenv";
import authRoutes from "./src/router/auth.route.js";
import userRoutes from "./src/router/user.route.js";
import taskRoutes from "./src/router/task.route.js";



dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Rutas
app.use("/functions/v1/chat", chatRoutes);
app.use("/functions/v1/auth", authRoutes);
app.use("/functions/v1/users", userRoutes);
app.use("/functions/v1/tasks", taskRoutes);


app.get("/", (req, res) => {
  res.send("Servidor funcionando 🚀");
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
