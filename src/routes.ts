import Router from "koa-router";

export const router = new Router();

router.get("/", (ctx) => {
    ctx.body = {
        message: "Hello World!"
    }
});