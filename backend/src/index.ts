import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { testConnection } from "./config/database";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello backend with CORS + TS + MySQL!");
});

// Test kết nối database khi khởi động server 
const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;
app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  
  // Test kết nối database
  await testConnection();
});
