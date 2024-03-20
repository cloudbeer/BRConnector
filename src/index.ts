import Koa from "koa";
import { router } from "./routes";

const app = new Koa();

app.use(router.routes());


const port = 3000;

app.listen(port, () => {
    console.log(`🚀 Server is running on port http://localhost:${port}/`);
});