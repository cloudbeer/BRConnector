import { ChatRequest, ResponseData } from "../entity/chat_request";
import AbstractProvider from "./abstract_provider";
import ChatMessageConverter from './chat_message';

import config from '../config';
import WebResponse from "../util/response";

import {
    BedrockRuntimeClient,
    InvokeModelCommand,
    InvokeModelWithResponseStreamCommand,
    ResponseStream,
} from "@aws-sdk/client-bedrock-runtime";

// SDK Not ready for Mistral...
export default class BedrockMixtral extends AbstractProvider {

    client: BedrockRuntimeClient;
    chatMessageConverter: ChatMessageConverter;
    constructor() {
        super();
        this.client = new BedrockRuntimeClient({ region: config.bedrock.region });
        this.chatMessageConverter = new ChatMessageConverter();
    }

    async chat(chatRequest: ChatRequest, session_id: string, ctx: any) {

        const payload = await this.chatMessageConverter.toMistralPayload(chatRequest);

        const body: any = {
            "max_tokens": chatRequest.max_tokens || 32000,
            "prompt": payload,
            "temperature": chatRequest.temperature || 1.0,
        };

        ctx.logger.debug(body);

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
            await this.chatStream(ctx, input, chatRequest, session_id);
        } else {
            ctx.set({
                'Content-Type': 'application/json',
            });
            ctx.body = await this.chatSync(ctx, input, chatRequest, session_id);
        }
    }
    async chatStream(ctx: any, input: any, chatRequest: ChatRequest, session_id: string) {
        let i = 0;
        try {
            const command = new InvokeModelWithResponseStreamCommand(input);
            const response = await this.client.send(command);



            if (response.body) {
                const streamResponse: AsyncIterable<ResponseStream> = response.body;
                let responseText = "";
                // const streams = response.body.options.messageStream;
                console.log("response.body", streamResponse);
                for await (const item of streamResponse) {

                }

                // const x = await response.body;
                // console.log("response.x", x.options);
                // for await (const item of response.body) {

                // }

                /*
                for await (const item of response.body) {
                    console.log("item", item);
                    if (item.chunk?.bytes) {
                        const decodedResponseBody = new TextDecoder().decode(
                            item.chunk.bytes,
                        );
                        const responseBody = JSON.parse(decodedResponseBody);

                        if (responseBody.delta?.type === "text_delta") {
                            i++;
                            responseText += responseBody.delta.text;
                            ctx.res.write("id: " + i + "\n");
                            ctx.res.write("event: message\n");
                            ctx.res.write("data: " + JSON.stringify({
                                choices: [
                                    { delta: { content: responseBody.delta.text } }
                                ]
                            }) + "\n\n");
                        } else if (responseBody.type === "message_stop") {
                            const {
                                inputTokenCount, outputTokenCount,
                                invocationLatency, firstByteLatency
                            } = responseBody["amazon-bedrock-invocationMetrics"];

                            const response: ResponseData = {
                                text: responseText,
                                input_tokens: inputTokenCount,
                                output_tokens: outputTokenCount,
                                invocation_latency: invocationLatency,
                                first_byte_latency: firstByteLatency
                            }

                            await this.saveThread(ctx, session_id, chatRequest, response);
                        }
                    }
                }
                */
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

    async chatSync(ctx: any, input: any, chatRequest: ChatRequest, session_id: string) {
        try {
            const command = new InvokeModelCommand(input);
            const apiResponse = await this.client.send(command);

            const decodedResponseBody = new TextDecoder().decode(apiResponse.body);

            const responseBody = JSON.parse(decodedResponseBody);


            const response: ResponseData = {
                text: responseBody.content[0].text,
                input_tokens: responseBody.usage.input_tokens,
                output_tokens: responseBody.usage.output_tokens,
                invocation_latency: 0,
                first_byte_latency: 0
            }

            await this.saveThread(ctx, session_id, chatRequest, response);


            // return responseBody;
            const choices = responseBody.content.map((c: any) => {
                return {
                    message: {
                        content: c.text,
                        role: "assistant"
                    }
                }
            });
            return {
                choices, usage: {
                    completion_tokens: responseBody.usage.output_tokens,
                    prompt_tokens: responseBody.usage.input_tokens,
                    total_tokens: responseBody.usage.input_tokens + responseBody.usage.output_tokens,
                }
            };
        } catch (e: any) {
            return WebResponse.error(e.message);
        }

    }

}