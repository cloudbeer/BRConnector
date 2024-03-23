import helper from "../../util/helper";

export default {

    apply: async (ctx: any) => {
        const body = ctx.request.body;
        if (!body.name) {
            throw new Error("name is required");
        }

        let apiKey: string = "";
        for (let i = 0; i < 10; i++) {
            apiKey = helper.genApiKey();
            console.log(apiKey);
            const existsKey = await ctx.db.loadByKV("eiai_key", "api_key", apiKey)
            if (!existsKey) {
                break;
            }
        }
        // const 

        const result = await ctx.db.insert("eiai_key", {
            name: body.name,
            api_key: apiKey,
            group_id: body.group_id || 0,
            role: body.role || "user",
        });

        ctx.body = result;
    }

}