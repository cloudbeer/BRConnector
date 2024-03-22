import Router from "koa-router";
import chat from './controller/runtime/chat';
export const router = new Router();




function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

router.get("/", ctx => {
    ctx.body = "Hi, I am an AI proxy.";
});

router.post("/v1/chat/completions", chat.completions);
