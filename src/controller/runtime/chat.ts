import provider from '../../providers/provider';

export default {
    completions: async (ctx: any) => {
        return provider.chat(ctx);
    },
    models: async (ctx: any) => {
        ctx.body = {
            "object": "list",
            "data": [
                {
                    "id": "claude-3-sonnet",
                    "object": "model",
                    "created": 1686935002,
                    "owned_by": "aws-bedrock"
                },
                {
                    "id": "claude-3-haiku",
                    "object": "model",
                    "created": 1686935002,
                    "owned_by": "aws-bedrock"
                },
            ]
        };
    },
}
