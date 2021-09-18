import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler } from "./middlewares/error.middleware";
import router from "./routes/index.routes";

const app = express();
app.use(morgan("dev"));
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

// api routes
app.use(router);
app.use(errorHandler);

export default app;