import Koa from "koa";
import { router } from "./routes";

const app = new Koa();

app.use(router.routes());


const port = 8866;

app.listen(port, () => {
    console.log(`🚀 Server is running on port http://localhost:${port}/`);
});