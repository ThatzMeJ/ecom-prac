import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./routes/routes";
import config from "./config/config";
import { proxyHandler } from "./handlers/proxy";
import { authMiddleware } from "./middleware/auth";

const app = express();

app.use(cors());
app.use(helmet());
if (config.env === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    name: routes[0].name,
    status: "healthy",
    timestamp: new Date().toISOString()
  });
});

// ✨ THE MAGIC HAPPENS HERE ✨
// Catch ALL requests and route them through the proxy handler
app.use('/', authMiddleware, proxyHandler);


app.listen(config.PORT, () => {
  console.log(`API Gateway is running on port ${config.PORT}`);
});
