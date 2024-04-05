import models from '../../models_data';

export default {
    list: async (ctx: any) => {
        ctx.body = {
            "object": "list",
            "data": models.filter(model => !model.deleted).map(model => ({
                "id": model.id,
                "object": model.object,
                "multiple": model.multiple,
                "created": model.created,
                "owned_by": model.owned_by

            }))

        };
    },
    detail: async (ctx: any) => {
    }
}
