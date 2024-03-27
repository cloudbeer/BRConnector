
import { ChatRequest } from "../entity/chat_request"

export default {
    genApiKey() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let key = '';
        const keyLength = 29;

        for (let i = 0; i < keyLength; i++) {
            key += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return "br-" + key;

    },
    async parseImageUrl(url: string): Promise<any> {
        if (url.indexOf('http://') >= 0 || url.indexOf('https://') >= 0) {
            const imageReq = await fetch(url);
            const blob = await imageReq.blob();
            let buffer = Buffer.from(await blob.arrayBuffer());

            return {
                "type": "base64",
                "media_type": blob.type,
                "data": buffer.toString('base64')
            };
        } else if (url.indexOf('data:') >= 0) {
            const media_type = url.substring(5, url.indexOf(';'));
            const type = url.substring(url.indexOf(';') + 1, url.indexOf(','));
            const data = url.substring(url.indexOf(',') + 1);
            return {
                type,
                media_type,
                data
            }
        }
        return null;
    },
    refineModelParameters: (chatRequest: ChatRequest) => {
        switch (chatRequest.model) {
            case 'claude-3-sonnet':
                chatRequest.model_id = "anthropic.claude-3-sonnet-20240229-v1:0";
                chatRequest.anthropic_version = "bedrock-2023-05-31";
                chatRequest.provider = "bedrock-claude3";
                chatRequest.price_in = 3.00 / 1000000;
                chatRequest.price_out = 15.00 / 1000000;
                chatRequest.currency = "USD";
                return chatRequest;
            case 'claude-3-haiku':
                chatRequest.model_id = "anthropic.claude-3-haiku-20240307-v1:0";
                chatRequest.anthropic_version = "bedrock-2023-05-31";
                chatRequest.provider = "bedrock-claude3";
                chatRequest.price_in = 0.25 / 1000000;
                chatRequest.price_out = 1.25 / 1000000;
                chatRequest.currency = "USD";
                return chatRequest;
            case 'claude-3-opus':
                chatRequest.model_id = "anthropic.claude-3-opus-20240307-v1:0";
                chatRequest.anthropic_version = "bedrock-2023-05-31";
                chatRequest.provider = "bedrock-claude3";
                chatRequest.price_in = 15.00 / 1000000;
                chatRequest.price_out = 75.00 / 1000000;
                chatRequest.currency = "USD";
                return chatRequest;
            default:
                chatRequest.model_id = "anthropic.claude-3-sonnet-20240229-v1:0";
                chatRequest.anthropic_version = "bedrock-2023-05-31";
                chatRequest.provider = "bedrock-claude3";
                chatRequest.price_in = 3.00 / 1000000;
                chatRequest.price_out = 15.00 / 1000000;
                chatRequest.currency = "USD";
                return chatRequest;
        }
    }


}