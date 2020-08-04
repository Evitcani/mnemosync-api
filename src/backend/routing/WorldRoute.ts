import {AbstractRoute} from "./AbstractRoute";
import {Application, Request, Response} from "express";
import {WorldController} from "../controllers/world/WorldController";
import {WorldConverter} from "../../shared/models/dto/converters/vo-to-dto/WorldConverter";
import {World} from "../entity/World";
import {inject, injectable} from "inversify";
import {ALL_WORLD_QUERY, WorldQuery} from "@evitcani/mnemoshared/dist/src/models/queries/WorldQuery";
import {TYPES} from "../../types";
import {CharacterController} from "../controllers/character/CharacterController";

@injectable()
export class WorldRoute extends AbstractRoute<WorldController, WorldConverter, World> {
    private characterController: CharacterController;

    constructor(@inject(TYPES.WorldController) worldController: WorldController,
                @inject(TYPES.CharacterController) characterController: CharacterController) {
        super(worldController, new WorldConverter());
        this.characterController = characterController;
    }

    protected async controllerCreate(item: World): Promise<World> {
        return this.controller.save(item);
    }

    defineRoutes(app: Application): void {
        app.post(`/api/worlds`, (req, res) => {
            return this.doBasicPost(req, res);
        });
        app.get(`/api/worlds`, (req, res) => {
            return this.getByQuery(req, res);
        });

        app.get(`/api/worlds/:id`, (req, res) => {
            return this.get(req, res);
        });

        app.put(`/api/worlds/:id`, (req, res) => {
            let id = this.getStringIdFromPath(req);
            if (!id) {
                return this.sendBadRequestResponse(res);
            }
            return this.doBasicPost(req, res, id);
        });

        app.post(`/api/worlds/:id`, (req, res) => {
            // TODO: Adding user to world.
        });
    }

    protected async get(req: Request, res: Response) {
        let id = this.getStringIdFromPath(req);
        if (!id) {
            return this.sendBadRequestResponse(res);
        }

        let world = await this.controller.getById(id);
        return this.getOKResponse(res, world);
    }

    protected async getByQuery(req: Request, res: Response) {
        let query: WorldQuery = this.parseQuery(req, ALL_WORLD_QUERY);
        if (query.character_id != null) {
            query.ids = await this.characterController.getWorldIdsByCharacterId(query.character_id);
        }

        let worlds = await this.controller.getAllByParams(query);
        return this.getOKResponseMulti(res, worlds);
    }
}