import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import config from "./config/config";

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
        service: "catalog-service", 
        status: "healthy",
        timestamp: new Date().toISOString()
    });
});


app.listen(config.PORT, () => {
    console.log(`Catalog service is running on port ${config.PORT}`);
});





