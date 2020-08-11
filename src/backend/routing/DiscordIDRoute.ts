import {AbstractRoute} from "./AbstractRoute";
import {CharacterController} from "../controllers/character/CharacterController";
import {Application, Request, Response} from "express";
import {inject, injectable} from "inversify";
import {TYPES} from "../../types";
import {WorldController} from "../controllers/world/WorldController";
import {ALL_DISCORD_ID_QUERY, DiscordIDQuery} from "mnemoshared/dist/src/models/queries/DisIDQuery";

@injectable()
export class DiscordIDRoute extends AbstractRoute<CharacterController, null, string, string> {
    private worldController: WorldController;

    constructor(@inject(TYPES.CharacterController) characterController: CharacterController,
                @inject(TYPES.WorldController) worldController: WorldController) {
        super(`discordIds`, characterController, null);
        this.worldController = worldController;
    }

    defineRoutes(app: Application): void {
        app.get(`${this.getBaseUrl()}`, (req, res) => {
            return this.getByQuery(req, res);
        });
    }

    private async getByQuery(req: Request, res: Response) {
        let query: DiscordIDQuery = this.parseQuery(req, ALL_DISCORD_ID_QUERY);

        let ids: Set<string> = new Set<string>();
        let characterIds = new Set<string>();
        if (query.character_ids != null) {
            if (Array.isArray(query.character_ids)) {
                characterIds = new Set<string>(query.character_ids);
            } else {
                characterIds.add(query.character_ids);
            }
        }

        if (query.character_id != null) {
            characterIds.add(query.character_id);
        }

        if (characterIds.size > 0) {
            ids = await this.controller.getDiscordId(Array.from(characterIds));
        }

        if (query.world_id != null) {
            let worlds = await this.worldController.getDiscordId(query.world_id);
            ids = new Set<string>([...ids, ...worlds]);
        }

        if (ids.size <= 0) {
            return this.sendOKResponse(res, null, false);
        }

        return this.sendOKResponseMulti(res, Array.from(ids.values()), false)
    }


    protected async controllerCreate(item: string): Promise<string> {
        // Unused by this routing service.
        return undefined;
    }
}