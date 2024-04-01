import response from '../util/response';
import config from '../config';
import DB from '../util/postgres';

const authHandler = async (ctx: any, next: any) => {
    const authorization = ctx.header.authorization || "";
    const api_key = authorization.length > 20 ? authorization.substring(7) : null;
    if (!api_key) {
        throw new Error("Unauthorized: api key required");
    }
    if (api_key === config.admin_api_key) {
        ctx.user = {
            id: 0,
            api_key: config.admin_api_key,
            name: "amdin",
            role: "admin"
        };
    } else if (ctx.db) {
        //TODO: refactor this to your cache service if too many access.
        const key = await ctx.db.loadByKV("eiai_key", "api_key", api_key);

        if (!key) {
            throw new Error("Unauthorized: api key error");
        }
        ctx.user = {
            id: key.id,
            api_key: key.api_key,
            name: key.admin,
            role: key.role
        };
    } else {
        // Anonymous access...
        console.log("Fake api key, anonymous access...");
        ctx.user = null;
    }

    const pathName = ctx.path;
    console.log("access: ", pathName);
    if (pathName.indexOf("/admin") >= 0) {
        if (!ctx.user || ctx.user.role !== "admin") {
            throw new Error("Unauthorized: you are not an admin role.")
        }
    }

    if (pathName.indexOf("/user") >= 0) {
        if (!ctx.user) {
            throw new Error("Unauthorized: you are not a member.")
        }
    }

    // if (pathName.indexOf("/v1") >= 0) {
    //     if (!ctx.user || ctx.user.id == 0) {
    //         throw new Error("Please use a valid api-key")
    //     }
    // }
    await next();

};

const errorHandler = async (ctx: any, next: any) => {
    try {
        await next();
    } catch (ex: any) {
        console.error(ex);
        ctx.body = response.error(ex.message);
    }
};


const databaseHandler = async (ctx: any, next: any) => {
    if (config.pgsql.host && config.pgsql.database) {
        ctx.db = await DB.build(config.pgsql);
    }
    await next();
};


export { errorHandler, authHandler, databaseHandler };