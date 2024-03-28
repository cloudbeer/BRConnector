import helper from "../../util/helper";

import WebResponse from "../../util/response";
export default {

    apply: async (ctx: any) => {
        const body = ctx.request.body;
        if (!body.name) {
            throw new Error("name is required");
        }

        let apiKey: string = "";
        for (let i = 0; i < 10; i++) {
            apiKey = helper.genApiKey();
            // console.log(apiKey);
            const existsKey = await ctx.db.loadByKV("eiai_key", "api_key", apiKey)
            if (!existsKey) {
                break;
            }
        }

        const result = await ctx.db.insert("eiai_key", {
            name: body.name,
            api_key: apiKey,
            group_id: body.group_id || 0,
            role: body.role || "user",
            email: body.email
        });

        ctx.body = WebResponse.ok(result);
    },
    list: async (ctx: any) => {
        const options = ctx.query;

        const limit = ~~(options.limit) || 20;
        const offset = ~~(options.offset) || 0;

        let where = "1=1";
        let params = [];

        let keys = [];
        if (options.q) {
            keys.push("q");
        }

        const conditions: any = {
            cols: "*",
            limit: limit,
            offset: offset,
            orderBy: "id desc"
        }

        for (const key of keys) {
            const keyIndex = keys.indexOf(key);
            if (key === "q") {
                params.push(`%${options.q}%`);
                where += ` and (name like $${keyIndex + 1} or email like  $${keyIndex + 1})`;
            }

        }


        conditions.where = where;
        conditions.params = params;
        const items = await ctx.db.list("eiai_key", conditions);
        const total = await ctx.db.count("eiai_key", conditions);

        ctx.body = WebResponse.ok({ items, total, limit, offset });
    }



}