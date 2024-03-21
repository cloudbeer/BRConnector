import { ChatRequest } from '../../entity/chat_request';
import { refineModelParameters } from '../../provider/common';
import provider from '../../provider/providers';

export default {
    completions: async (ctx: any) => {
        const chatRequest: ChatRequest = ctx.request.body;
        return provider.chat(chatRequest, ctx);
    }
}