import { config } from "dotenv";

const configFile = `./.env`;
config({ path: configFile });

const { PORT, NODE_ENV } =
    process.env;

export default {
    PORT,
    env: NODE_ENV,
};