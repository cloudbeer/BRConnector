
import service from "../../service/model"
import AbstractController from "../AbstractController";

class ModelController extends AbstractController {

    routers(router: any): void {
        router.post("/admin/model/save-kb-model", this.saveKnowledgeBaseModel);
        router.get("/admin/model/list", this.list);
        router.get("/admin/model/detail/:id", async (ctx: any) => {
            return this.detail(ctx, "eiai_model");
        });
    }

    async saveKnowledgeBaseModel(ctx: any) {
        const data = ctx.request.body;
        let { id, name, provider, object, multiple, owned_by, knowledgeBaseId, summaryModel, region } = data;

        if (!name) {
            throw new Error("name is required");
        }

        if (!provider) {
            throw new Error("provider is required, now supported providers include: bedrock-knowledge-base");
        }

        if (!knowledgeBaseId) {
            throw new Error("knowledgeBaseId is required");
        }
        if (!summaryModel) {
            throw new Error("summaryModel is required");
        }
        if (!region) {
            region = "us-east-1";
        }

        if (["claude-3-sonnet", "claude-3-haiku", "claude-3-opus",].indexOf(summaryModel) === -1) {
            throw new Error("summaryModel must be one of the followings: claude-3-sonnet, claude-3-haiku or claude-3-opus");
        }

        const config = JSON.stringify({
            knowledgeBaseId, summaryModel, region, provider, object, multiple, owned_by
        });

        let result: any;
        if (id) {
            result = await service.update(ctx.db, {
                id,
                name,
                config
            });
        } else {
            result = await service.create(ctx.db, {
                name,
                config
            });
        }
        return super.ok(ctx, result);
    }
    async list(ctx: any) {
        const options = ctx.query;
        const result = await service.list(ctx.db, options);
        return super.ok(ctx, result);
    }
}

export default (router: any) => new ModelController(router);