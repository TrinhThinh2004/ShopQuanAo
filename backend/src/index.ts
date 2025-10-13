import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { testConnection } from "./config/database";
import productsRouter from "./routes/products";
import authRouter from "./routes/auth";
import adminRouter from "./routes/admin";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Serve static files từ thư mục uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get("/", (req, res) => {
  res.send("Hello backend with CORS + TS + MySQL!");
});

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/products', productsRouter);
app.use('/api/v1/admin', adminRouter);

// Test kết nối database khi khởi động server 
const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;
app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  
  // Test kết nối database
  await testConnection();
});
