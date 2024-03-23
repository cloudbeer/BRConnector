import { ChatRequest } from "../entity/chat_request"
import { Provider } from "./common"
import {
    BedrockRuntimeClient,
    InvokeModelWithResponseStreamCommand,
} from "@aws-sdk/client-bedrock-runtime";
import config from '../config';

export default class BedrockClaude extends Provider {

    client: BedrockRuntimeClient;

    constructor() {
        super();
        this.client = new BedrockRuntimeClient({ region: config.bedrock.region });
    }

    //TODO: Change playload, I need more information.
    convertMessagePayload(chatRequest: ChatRequest): any {
        const messages = chatRequest.messages;
        const lastMessage = messages.pop();

        const systemMessages = messages.filter(message => message.role === 'system');
        const userMessages = messages.filter(message => message.role === 'user');
        const assistantMessages = messages.filter(message => message.role === 'assistant');

        const systemPrompt = systemMessages.reduce((acc, message) => {
            return acc + message.content;
        }, "");
        const userPrompts = userMessages.map(message => {
            return {
                type: "text",
                text: message.content
            }
        });
        const assistantPrompts = assistantMessages.map(message => ({
            type: "text",
            text: message.content
        }));

        const new_messages: any = [];
        if (assistantMessages.length == 0) {
            userPrompts.push({
                type: "text",
                text: lastMessage?.content
            });
            new_messages.push({
                role: "user",
                content: userPrompts
            });
        } else {
            new_messages.push({
                role: "user",
                content: userPrompts
            });
            new_messages.push({
                role: "assistant",
                content: assistantPrompts
            });
            new_messages.push({
                role: "user",
                content: [{
                    type: "text",
                    text: lastMessage?.content
                }]
            })
        }


        return { messages: new_messages, systemPrompt }

    }

    async chat(chatRequest: ChatRequest, ctx: any) {
        const payload = this.convertMessagePayload(chatRequest);

        const body: any = {
            "anthropic_version": chatRequest["anthropic_version"],
            "max_tokens": chatRequest["max_tokens"] || 4096,
            "messages": payload.messages,
            // system: payload.system,
        };
        if (payload.systemPrompt && payload.systemPrompt.length > 0) {
            body.system = JSON.stringify(payload.systemPrompt);
        }

        // console.log(body);

        const input = {
            body: JSON.stringify(body),
            contentType: "application/json",
            accept: "application/json",
            modelId: chatRequest.model_id,
        };

        ctx.status = 200;
        ctx.set({
            'Connection': 'keep-alive',
            'Cache-Control': 'no-cache',
            'Content-Type': 'text/event-stream',
        });

        let i = 0;
        // ctx.res.write("id: " + i + "\n");
        // ctx.res.write("event: open\n");
        // ctx.res.write("data: ok\n\n");

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
                            i++;
                            ctx.res.write("id: " + i + "\n");
                            ctx.res.write("event: message\n");
                            ctx.res.write("data: " + JSON.stringify({
                                choices: [
                                    { delta: { content: responseBody.delta.text } }
                                ]
                            }) + "\n\n");
                        }
                    }
                }
            } else {
                ctx.res.write("id: " + (i + 1) + "\n");
                ctx.res.write("event: message\n");
                ctx.res.write("data: " + JSON.stringify({
                    choices: [
                        { delta: { content: "Error invoking model" } }
                    ]
                }) + "\n\n");
            }
        } catch (e: any) {
            console.error(e);
            ctx.res.write("id: " + (i + 1) + "\n");
            ctx.res.write("event: message\n");
            ctx.res.write("data: " + JSON.stringify({
                choices: [
                    { delta: { content: "Error invoking model" } }
                ]
            }) + "\n\n");
        }

        ctx.res.write("id: " + (i + 1) + "\n");
        ctx.res.write("event: message\n");
        ctx.res.write("data: [DONE]\n\n")
        ctx.res.end();
    }


}