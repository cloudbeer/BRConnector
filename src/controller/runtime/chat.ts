import { Context } from 'koa'
import provider from '../../provider/providers';

export default {
    completions: async (ctx: Context) => {
        return provider.chat(ctx);
    }
}