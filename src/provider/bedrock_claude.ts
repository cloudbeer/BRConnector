import { ChatRequest } from "../entity/chat_request"
import { Provider } from "./common"
import {
    BedrockRuntimeClient,
    InvokeModelCommand,
    InvokeModelWithResponseStreamCommand,
} from "@aws-sdk/client-bedrock-runtime";
import config from '../config';
import helper from "../util/helper";
import WebResponse from "../util/response";


export default class BedrockClaude extends Provider {

    client: BedrockRuntimeClient;

    constructor() {
        super();
        this.client = new BedrockRuntimeClient({ region: config.bedrock.region });
    }

    async convertContent(content: any): Promise<any> {
        if (typeof content === "string") {
            return [{
                type: "text",
                text: content
            }];
        }
        if (Array.isArray(content)) {
            return Promise.all(content.map(async item => {
                return await this.convertSingleType(item);
            }));
        }
        return [];
    }

    async convertSingleType(contentItem: any) {
        if (contentItem.type === "image_url") {
            const url = contentItem.image_url.url;
            const source = await helper.parseImageUrl(url);
            return {
                type: "image",
                source
            }
        } else if (contentItem.type === "text") {
            return {
                type: "text",
                text: contentItem.text
            }
        }
        return contentItem;
    }

    //TODO: Change playload, I need more information.
    async convertMessagePayload(chatRequest: ChatRequest): Promise<any> {
        const messages = chatRequest.messages;
        const lastMessage = messages.pop();

        // console.log(lastMessage, isBedrockSchema, lastMessage?.content?.type);

        const systemMessages = messages.filter(message => message.role === 'system');
        const userMessages = messages.filter(message => message.role === 'user');
        const assistantMessages = messages.filter(message => message.role === 'assistant');

        const systemPrompt = systemMessages.reduce((acc, message) => {
            return acc + message.content;
        }, "");
        const userPrompts = Promise.all(
            userMessages.map(
                async message => await this.convertContent(message.content)
            )
        );
        // console.log("UUUUU", JSON.stringify(await userPrompts, null, 2))

        const assistantPrompts = Promise.all(
            assistantMessages.map(
                async message => await this.convertContent(message.content)
            )
        );

        const new_messages: any = [];

        if (assistantMessages.length == 0) {
            const content = await this.convertContent(lastMessage?.content)
            new_messages.push({
                role: "user",
                content
            });
        } else {
            new_messages.push({
                role: "user",
                content: (await userPrompts)[0]
            });
            new_messages.push({
                role: "assistant",
                content: (await assistantPrompts)[0]
            });
            const content = await this.convertContent(lastMessage?.content)
            new_messages.push({
                role: "user",
                content
            });
        }

        return { messages: new_messages, systemPrompt }

    }

    async chat(chatRequest: ChatRequest, ctx: any) {
        const payload = await this.convertMessagePayload(chatRequest);


        const body: any = {
            "anthropic_version": chatRequest["anthropic_version"],
            "max_tokens": chatRequest["max_tokens"] || 4096,
            "messages": payload.messages,
            // system: payload.system,
        };
        if (payload.systemPrompt && payload.systemPrompt.length > 0) {
            body.system = JSON.stringify(payload.systemPrompt);
        }

        // if (1 == 1) throw Error();
        // console.log(body);

        // console.log(JSON.stringify(body, null, 2));


        const input = {
            body: JSON.stringify(body),
            contentType: "application/json",
            accept: "application/json",
            modelId: chatRequest.model_id,
        };

        ctx.status = 200;

        if (chatRequest.stream) {
            ctx.set({
                'Connection': 'keep-alive',
                'Cache-Control': 'no-cache',
                'Content-Type': 'text/event-stream',
            });
            await this.chatStream(ctx, input);
        } else {
            ctx.set({
                'Content-Type': 'application/json',
            });
            ctx.body = await this.chatSync(input);
        }
    }

    async chatStream(ctx: any, input: any) {
        let i = 0;
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

    async chatSync(input: any) {
        try {
            const command = new InvokeModelCommand(input);
            const apiResponse = await this.client.send(command);

            const decodedResponseBody = new TextDecoder().decode(apiResponse.body);

            const responseBody = JSON.parse(decodedResponseBody);
            return responseBody;
            //res.choices?.at(0)?.message?.content ?? "";
            // const choices = responseBody.content.map((c: any) => {
            //     return {
            //         message: {
            //             content: c.text,
            //             role: "assistant"
            //         }
            //     }
            // });
            // return {
            //     choices, usage: {
            //         completion_tokens: responseBody.usage.output_tokens,
            //         prompt_tokens: responseBody.usage.input_tokens,
            //         total_tokens: responseBody.usageinput_tokens + responseBody.usage.output_tokens,
            //     }
            // };
        } catch (e: any) {
            return WebResponse.error(e.message);
        }

    }

}
