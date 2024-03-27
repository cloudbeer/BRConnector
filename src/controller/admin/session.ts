import helper from "../../util/helper";
import WebResponse from "../../util/response";

export default {

    detail: async (ctx: any) => {
        const id = ctx.query.id;
        if (!id) {
            throw new Error("id is required");
        }


        const result = await ctx.db.loadById("eiai_session", ~~id)
        ctx.body = WebResponse.ok(result);
    }

}