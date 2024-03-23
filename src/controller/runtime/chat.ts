import provider from '../../provider/providers';

export default {
    completions: async (ctx: any) => {
        return provider.chat(ctx);
    }
}