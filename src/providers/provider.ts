import { ChatRequest } from "../entity/chat_request"
import helper from '../util/helper';
import api_key from "../service/key";
// Providers
import AbstractProvider from "./abstract_provider";
import BedrockClaude from "./bedrock_claude";

class Provider {
    constructor() {
        this["bedrock-claude3"] = new BedrockClaude();
    }
    async chat(ctx: any) {
        const keyData = await api_key.loadById(ctx.db, ctx.user.id);
        // 如果没有启用数据库和 api key 则不验证。
        if (keyData) {
            await this.checkFee(ctx, keyData);
        }
        const chatRequest: ChatRequest = ctx.request.body;
        const session_id = ctx.headers["session-id"];
        helper.refineModelParameters(chatRequest);
        const provider: AbstractProvider = this[chatRequest.provider];
        provider.setkeyData(keyData);
        try {
            return provider.chat(chatRequest, session_id, ctx);
        } catch (ex: any) {
            throw new Error(ex.message);
        }
    }

    async checkFee(ctx: any, key: any) {
        let month_fee = parseFloat(key.month_fee);
        const month_quota = parseFloat(key.month_quota);
        const balance = parseFloat(key.balance);

        if (month_fee > 0) {
            // New month set it to 0
            const lastUpdate = new Date(key.updated_at);
            const now = new Date();
            if (now.getMonth() != lastUpdate.getMonth() || now.getFullYear() > lastUpdate.getFullYear()) {
                month_fee = 0;
                await api_key.update(ctx.db, {
                    id: ctx.user.id,
                    month_fee: 0
                });
            }
        }
        if (month_fee >= month_quota && balance <= 0) {
            throw new Error("Please recharge.")
        }
    }
}

export default new Provider();

