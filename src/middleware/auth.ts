import response from '../util/response';

export default async (ctx: any, next: any) => {
    const authorization = ctx.header.authorization || "";
    const api_key = authorization.length > 20 ? authorization.substring(7) : null;
    if (!api_key) {
        ctx.body = response.error("Unauthorized");
        return;
    }
    await next();
}