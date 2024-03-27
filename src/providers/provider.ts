import { ChatRequest } from "../entity/chat_request"
import helper from '../util/helper';
import BedrockClaude from "./bedrock_claude";

class Provider {
    constructor() {
        this["bedrock-claude3"] = new BedrockClaude();
    }
    async chat(ctx: any) {
        const chatRequest: ChatRequest = ctx.request.body;
        // console.log(ctx.headers);
        const session_id = ctx.headers["session-id"];
        helper.refineModelParameters(chatRequest);
        return this[chatRequest.provider].chat(chatRequest, session_id, ctx);

    }
}

export default new Provider();

// export default {
//     "bedrock-claude3": new BedrockClaude(),
//     chat: (ctx: any) => {
//         const chatRequest: ChatRequest = ctx.request.body;
//         const session_id = ctx.request.headers["SessionID"];
//         refineModelParameters(chatRequest);
//         return this[chatRequest.provider].chat(chatRequest, session_id, ctx);
//     }
// }



// // export default { providers, Provider, refineModelParameters }


// export default {
//     "bedrock-claude3": new BedrockClaude(),
//     get: (id) => {
//         return this[id];
//     }
// }
