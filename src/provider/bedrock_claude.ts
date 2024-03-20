import { ChatRequest } from "../entity/chat_request"
import { Provider } from "./common"
import {
    BedrockRuntimeClient,
    InvokeModelWithResponseStreamCommand,
} from "@aws-sdk/client-bedrock-runtime";
import config from '../config';
import responseUtil from '../util/response';

export default class BedrockClaude extends Provider {

    client: BedrockRuntimeClient;

    constructor() {
        super();
        this.client = new BedrockRuntimeClient({ region: config.bedrock.region });
    }
    async chat(chatRequest: ChatRequest, ctx: any) {
        const body = {
            "anthropic_version": chatRequest["anthropic_version"],
            "max_tokens": chatRequest["max_tokens"] || 4096,
            "messages": chatRequest.messages as any
        };
        const input = {
            body: JSON.stringify(body),
            contentType: "application/json",
            accept: "application/json",
            modelId: chatRequest.model_id,
        };

        try {
            const command = new InvokeModelWithResponseStreamCommand(input);
            const response = await this.client.send(command);

            if (response.body) {
                for await (const item of response.body) {
                    if (item.chunk?.bytes) {
                        const decodedResponseBody = new TextDecoder().decode(
                            item.chunk.bytes,
                        );
                        const responseBody = JSON.parse(decodedResponseBody);
                        if (responseBody.delta?.type === "text_delta") {
                            // console.log(responseBody.delta.text);
                            ctx.res.write(responseBody.delta.text);
                        }
                    }
                }
                ctx.res.end();
            } else {
                // Handle errors
                ctx.body = responseUtil.error("Error invoking model");
            }
        } catch (e: any) {
            console.error(e);
            ctx.body = responseUtil.error("Error invoking model");
        }
    }


}
