import WebResponse from "../../util/response";
import Thread from "../../service/thread"

export default {

    detail: async (ctx: any) => {
        const id = ctx.query.id || ctx.params.id;
        const key_id = ctx.user.id;
        const result = await Thread.detail(ctx.db, { id, key_id })
        ctx.body = WebResponse.ok(result);
    },
    list: async (ctx: any) => {
        const options = ctx.query;
        const key_id = ctx.user.id;
        options.key_id = key_id;
        const result = await Thread.list(ctx.db, options);
        ctx.body = WebResponse.ok(result);

    }

}