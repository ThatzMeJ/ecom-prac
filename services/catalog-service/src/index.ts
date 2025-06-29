import express, { Request, Response } from "express";
import morgan from "morgan";
import config from "./config/config.js";
import productListingRoute from "./routes/productListingRoute.js";

const app = express();

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

app.use("/api/v1/products", productListingRoute);


app.listen(config.PORT, () => {
    console.log(`Catalog service is running on port ${config.PORT}`);
});





