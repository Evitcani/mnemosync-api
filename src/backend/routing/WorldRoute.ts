import {AbstractRoute} from "./AbstractRoute";
import {Application, Request, Response} from "express";
import {WorldController} from "../controllers/world/WorldController";
import {World} from "../entity/World";
import {inject, injectable} from "inversify";
import {ALL_WORLD_QUERY, WorldQuery} from "@evitcani/mnemoshared/dist/src/models/queries/WorldQuery";
import {TYPES} from "../../types";
import {CharacterController} from "../controllers/character/CharacterController";
import {WorldConverter} from "../../shared/models/converters/WorldConverter";

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
            return this.createNewWorld(req, res);
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
            return this.addUserToWorld(req, res);
        });
    }

    protected async createNewWorld(req: Request, res: Response) {
        let query: WorldQuery = this.parseQuery(req, ALL_WORLD_QUERY);
        if (!query.discord_id) {
            return this.sendBadRequestResponse(res);
        }

        // Get the body.
        let vo: World = this.getBodyFromRequest(req);
        if (!vo) {
            return this.sendBadRequestResponse(res);
        }

        // Create the world.
        vo = await this.controllerCreate(vo);
        if (!vo) {
            return this.sendBadRequestResponse(res);
        }

        // Now, post user to worlds.
        let flag: boolean = await this.controller.saveUserToWorld(query.discord_id, vo.id);
        if (!flag) {
            return this.sendBadRequestResponse(res);
        }

        return this.getOKResponse(res, vo);
    }

    protected async addUserToWorld(req: Request, res: Response) {
        let id = this.getStringIdFromPath(req);
        if (!id) {
            return this.sendBadRequestResponse(res);
        }
        let query: WorldQuery = this.parseQuery(req, ALL_WORLD_QUERY);
        if (!query.discord_id) {
            return this.sendBadRequestResponse(res);
        }

        let flag: boolean = await this.controller.saveUserToWorld(query.discord_id, id);
        if (!flag) {
            return this.sendBadRequestResponse(res);
        }

        return this.getOKResponse(res, null);
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