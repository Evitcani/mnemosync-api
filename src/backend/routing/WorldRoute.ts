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
        super(`worlds`, worldController, new WorldConverter());
        this.characterController = characterController;
    }

    protected async controllerCreate(item: World): Promise<World> {
        return this.controller.save(item);
    }

    defineRoutes(app: Application): void {
        app.route(`${this.getBaseUrl()}`)
            .post((req, res) => {
                return this.createNewWorld(req, res);
            })
            .get((req, res) => {
                return this.getByQuery(req, res);
            });
        app.route(`${this.getBaseUrl()}/:id`)
            .get((req, res) => {
                return this.get(req, res);
            })

            .put((req, res) => {
                let id = this.getStringIdFromPath(req);
                if (!id) {
                    return this.sendBadRequestResponse(res);
                }
                return this.doBasicPost(req, res, id);
            })

            .post((req, res) => {
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

        return this.sendOKResponse(res, vo);
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

        return this.sendOKResponse(res, null);
    }

    protected async get(req: Request, res: Response) {
        let id = this.getStringIdFromPath(req);
        if (!id) {
            return this.sendBadRequestResponse(res);
        }

        let world = await this.controller.getById(id);
        return this.sendOKResponse(res, world);
    }

    protected async getByQuery(req: Request, res: Response) {
        let query: WorldQuery = this.parseQuery(req, ALL_WORLD_QUERY);

        let ids = new Set<string>();
        if (query.ids != null) {
            if (typeof query.ids == 'string') {
                let id = query.ids;
                if (!id) {
                    ids.add(id);
                }
            } else {
                query.ids.forEach((id) => {
                    ids.add(id);
                });
            }
        }

        if (query.id != null) {
            ids.add(query.id);
            query.id = null;
        }

        if (query.character_id != null) {
            let cIds = await this.characterController.getWorldIdsByCharacterId(query.character_id);
            if (cIds != null) {
                ids = new Set<string>([...cIds, ...ids]);
            }

            query.character_id = null;
        }

        // Replace the IDs.
        if (ids.size > 0) {
            query.ids = Array.from(ids);
        }


        let worlds = await this.controller.getAllByParams(query);
        return this.sendOKResponseMulti(res, worlds);
    }
}