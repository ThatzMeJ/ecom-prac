import { config } from "dotenv";

const configFile = `./.env`;
config({ path: configFile });

const { PORT, NODE_ENV, JWT_SECRET, JWT_EXPIRES_IN, JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRES_IN } =
    process.env;

export default {
    PORT: PORT || 3001,
    env: NODE_ENV,
    JWT_SECRET: JWT_SECRET || "your-super-secret-jwt-key-change-in-production",
    JWT_EXPIRES_IN: JWT_EXPIRES_IN || "24h",
    JWT_REFRESH_SECRET: JWT_REFRESH_SECRET || "your-super-secret-refresh-key-change-in-production",
    JWT_REFRESH_EXPIRES_IN: JWT_REFRESH_EXPIRES_IN || "7d",
};