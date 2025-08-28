import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import shipmentRoutes from "./routes/shipments.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Enable CORS
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Parse JSON request bodies
app.use(express.json());

// Auth routes
app.use("/api/auth", authRoutes);

// Shipment routes
app.use("/api/shipments", shipmentRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ message: "Server is running!" });
});

// Global error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
  }
);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
