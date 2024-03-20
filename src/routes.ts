import Router from "koa-router";
import chat from './controller/runtime/chat';

export const router = new Router();


router.get("/", (ctx) => {
    ctx.body = {
        message: "Hello World!"
    }
});


router.post("/v1/chat/completions", chat.completions);
