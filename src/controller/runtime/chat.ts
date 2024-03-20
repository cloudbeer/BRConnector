import { ChatRequest } from '../../entity/chat_request';
import { refineModelParameters } from '../../provider/common';
import providers from '../../provider/providers';

export default {
    completions: async (ctx: any) => {
        const chatRequest: ChatRequest = ctx.request.body;
        refineModelParameters(chatRequest);
        return (providers as any)[chatRequest.provider].chat(chatRequest, ctx);
        // ctx.body = response.ok(chatRequest);
    }
}