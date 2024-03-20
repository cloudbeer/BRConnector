import Koa from "koa";
import { bodyParser } from "@koa/bodyparser"
import cors from "@koa/cors"
import auth from './middleware/auth'
import { router } from "./routes";
import install from './install'

const app = new Koa();
app.use(bodyParser());
app.use(cors());
// app.use(auth);
app.use(router.routes());

install();

const port = 8866;

app.listen(port, () => {
    console.log(`🚀 Server is running on port http://localhost:${port}/`);
});