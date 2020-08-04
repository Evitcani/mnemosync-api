import {AbstractRoute} from "./AbstractRoute";
import {CharacterController} from "../controllers/character/CharacterController";
import {Application, Request, Response} from "express";
import {inject, injectable} from "inversify";
import {TYPES} from "../../types";
import {WorldController} from "../controllers/world/WorldController";
import {ALL_DISCORD_ID_QUERY, DiscordIDQuery} from "@evitcani/mnemoshared/dist/src/models/queries/DisIDQuery";

@injectable()
export class DiscordIDRoute extends AbstractRoute<CharacterController, null, string> {
    private worldController: WorldController;

    constructor(@inject(TYPES.CharacterController) characterController: CharacterController,
                @inject(TYPES.WorldController) worldController: WorldController) {
        super(characterController, null);
    }

    defineRoutes(app: Application): void {
        app.get(`/api/discordIds`, (req, res) => {
            return this.getByQuery(req, res);
        });
    }

    private async getByQuery(req: Request, res: Response) {
        let query: DiscordIDQuery = this.parseQuery(req, ALL_DISCORD_ID_QUERY);

        let ids: Set<string> = new Set<string>();
        if (query.character_id != null) {
            ids = await this.controller.getDiscordId(query.character_id);
        }

        if (query.world_id != null) {
            let worlds = await this.worldController.getDiscordId(query.world_id);
            ids = new Set<string>([...ids, ...worlds]);
        }

        if (ids.size <= 0) {
            return this.getOKResponse(res, null);
        }

        return this.getOKResponseMulti(res, Array.from(ids.values()))
    }


    protected async controllerCreate(item: string): Promise<string> {
        // Unused by this routing service.
        return undefined;
    }
}