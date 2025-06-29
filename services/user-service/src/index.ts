import express from "express";
import morgan from "morgan";
import config from "./config/config";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";

const app = express();



if (config.env === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    service: "user-service",
    status: "healthy",
    timestamp: new Date().toISOString()
  });
});

// Route mounting with proper separation
app.use("/api/v1/users", userRoutes);   // User CRUD operations
app.use("/api/v1/auth", authRoutes);    // Authentication operationsusrers

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.listen(config.PORT, () => {
  console.log(`User service is running on port ${config.PORT}`);
});