import Router from "koa-router";
import chat from './controller/runtime/chat';
import admin_api_key from './controller/admin/api_key';
import admin_session from './controller/admin/session';
import admin_thread from './controller/admin/thread';
import user_session from './controller/user/session';
import user_thread from './controller/user/thread';

export const router = new Router();


router.get("/", ctx => {
    ctx.body = "Hi, I am an AI proxy.";
});

// AI API
router.post("/v1/chat/completions", chat.completions);

// Admin APIs
router.post("/admin/api-key/apply", admin_api_key.apply);
router.get("/admin/api-key/list", admin_api_key.list);

router.get("/admin/session/detail", admin_session.detail);
router.get("/admin/session/detail/:id", admin_session.detail);
router.get("/admin/session/list", admin_session.list);

router.get("/admin/thread/detail", admin_thread.detail);
router.get("/admin/thread/detail/:id", admin_thread.detail);
router.get("/admin/thread/list", admin_thread.list);

// User APIs
router.get("/user/session/detail", user_session.detail);
router.get("/user/session/detail/:id", user_session.detail);
router.get("/user/session/list", user_session.list);

router.get("/user/thread/detail", user_thread.detail);
router.get("/user/thread/detail/:id", user_thread.detail);
router.get("/user/thread/list", user_thread.list);