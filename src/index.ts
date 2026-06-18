import express from "express";
import { listen } from "node:quic";
import authRoutes from "./routes/auth.route";
import categoryRoutes from "./routes/categories.route";

const app = express();
app.use(express.json());

const port = process.env.PORT || 4000;

app.get("/", async (req, res) => {
  res.send("<h1>AGAIN T?!</h1>");
});

app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);

app.listen(port, () => {
  console.log(`port ${port} is working`);
});
