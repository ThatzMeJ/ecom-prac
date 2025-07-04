import { config } from "dotenv";

config();

const { PORT, NODE_ENV } = process.env;

export default {
    PORT: parseInt(PORT || "3000"),
    env: NODE_ENV || "development",
    JWT_SECRET: process.env.JWT_SECRET || "your-default-secret"
};