import { ChatRequest } from '../entity/chat_request';
function refineModelParameters(chatRequest: ChatRequest) {
    switch (chatRequest.model) {
        case 'claude-3-sonnet':
            chatRequest.model_id = "anthropic.claude-3-sonnet-20240229-v1:0";
            chatRequest.anthropic_version = "bedrock-2023-05-31";
            chatRequest.provider = "bedrock-claude3";
            return chatRequest;

        case 'claude-3-haiku':
            chatRequest.model_id = "anthropic.claude-3-haiku-20240307-v1:0";
            chatRequest.anthropic_version = "bedrock-2023-05-31";
            chatRequest.provider = "bedrock-claude3";
            return chatRequest;

        default:
            chatRequest.model_id = "anthropic.claude-3-sonnet-20240229-v1:0";
            chatRequest.anthropic_version = "bedrock-2023-05-31";
            chatRequest.provider = "bedrock-claude3";
            return chatRequest;
    }
}

abstract class Provider {
    constructor() {
    }
    // stream chat
    abstract chat(chatRequest: ChatRequest, ctx: any): void;

    save(chatRequest: ChatRequest, response: any, key: string, model: string) {
        console.log("save...", chatRequest);
    };
}


export { refineModelParameters, Provider };