import Koa from "koa";
import { bodyParser } from "@koa/bodyparser"
import cors from "@koa/cors"
import { authHandler, errorHandler, databaseHandler } from './middleware/handlers'
import { router } from "./routes";
import install from './install'


install();


const app = new Koa();

app.use(errorHandler);

app.use(bodyParser());

app.use(cors());

app.use(databaseHandler);

app.use(authHandler);

app.use(router.routes());


const port = 8866;

app.listen(port, () => {
    console.log(`🚀 Server is running on port http://0.0.0.0:${port}/`);
});