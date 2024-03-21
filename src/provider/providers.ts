import { ChatRequest } from "../entity/chat_request"
import BedrockClaude from "./bedrock_claude"
import { refineModelParameters } from "./common";

const providers: any = {
    "bedrock-claude3": new BedrockClaude(),
    chat: (chatRequest: ChatRequest, ctx: any) => {
        refineModelParameters(chatRequest);
        return providers[chatRequest.provider].chat(chatRequest, ctx);
    }
}

export default providers