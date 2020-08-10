import {AbstractRoute} from "./AbstractRoute";
import {PartyController} from "../controllers/party/PartyController";
import {inject, injectable} from "inversify";
import {TYPES} from "../../types";
import {Application, Request, Response} from "express";
import {CharacterController} from "../controllers/character/CharacterController";
import {Party} from "../entity/Party";
import {ALL_PARTY_QUERY, PartyQuery} from "mnemoshared/dist/src/models/queries/PartyQuery";
import {PartyConverter} from "../../shared/models/converters/PartyConverter";
import {PartyDTO} from "mnemoshared/dist/src/dto/model/PartyDTO";

@injectable()
export class PartyRoute extends AbstractRoute<PartyController, PartyConverter, Party, PartyDTO> {
    private characterController: CharacterController;

    constructor(@inject(TYPES.PartyController) controller: PartyController,
                @inject(TYPES.CharacterController) characterController: CharacterController) {
        super(`parties`, controller, new PartyConverter());
        this.characterController = characterController;
    }

    defineRoutes(app: Application): void {
        app.route(`${this.getBaseUrl()}`)
            .get((req, res) => {
                return this.getByQuery(req, res);
            })
            .post((req, res) => {
                return this.doBasicPost(req, res);
            });
        app.route(`${this.getBaseUrl()}/:id`)
            .put((req, res) => {
                let id = this.getNumberIdFromPath(req);
                if (!id) {
                    return this.sendBadRequestResponse(res);
                }

                return this.doBasicPost(req, res, id);
            })
            .get((req, res) => {
                return this.get(req, res);
            });
    }

    private async get(req: Request, res: Response) {
        let id = this.getNumberIdFromPath(req);
        if (!id) {
            return this.sendBadRequestResponse(res);
        }

        let vo = await this.controller.getById(id);
        return this.sendOKResponse(res, vo);
    }

    private async getByQuery(req: Request, res: Response) {
        let query: PartyQuery = this.parseQuery(req, ALL_PARTY_QUERY);
        let characterId: string = query.character_id;
        if (characterId != null) {
            let character = await this.characterController.getById(characterId);

            if (character == null || character.party == null) {
                return this.sendOKResponse(res, null);
            }

            return this.sendOKResponseMulti(res, [character.party]);
        }

        if (query.world_id != null) {
            let party = await this.controller.getByWorld(query.world_id);
            return this.sendOKResponseMulti(res, party);
        }

        if (query.guild_id != null) {
            if (query.name != null) {
                let parties = await this.controller.getByNameAndGuild(query.name, query.guild_id);
                return this.sendOKResponseMulti(res, parties);
            }

            let party = await this.controller.getByGuild(query.guild_id);
            return this.sendOKResponseMulti(res, party);
        }

        return res.status(400).json({data: null});
    }

    protected async controllerCreate(item: Party): Promise<Party> {
        return this.controller.save(item);
    }
}