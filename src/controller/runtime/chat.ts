import { ChatRequest } from '../../entity/chat_request';
import { refineModelParameters } from '../../provider/common';
import provider from '../../provider/providers';

export default {
    completions: async (ctx: any) => {
        return provider.chat(ctx);
    }
}