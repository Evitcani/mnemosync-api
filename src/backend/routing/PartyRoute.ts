import {AbstractRoute} from "./AbstractRoute";
import {PartyController} from "../controllers/party/PartyController";
import {inject, injectable} from "inversify";
import {TYPES} from "../../types";
import {Application, Request, Response} from "express";
import {PartyConverter} from "../../shared/models/dto/converters/vo-to-dto/PartyConverter";
import {CharacterController} from "../controllers/character/CharacterController";
import {Party} from "../entity/Party";
import {ALL_PARTY_QUERY, PartyQuery} from "../../shared/models/queries/PartyQuery";
import {StringUtility} from "@evitcani/mnemoshared/dist/src/utilities/StringUtility";

@injectable()
export class PartyRoute extends AbstractRoute<PartyController, PartyConverter, Party> {
    private characterController: CharacterController;

    constructor(@inject(TYPES.PartyController) controller: PartyController,
                @inject(TYPES.CharacterController) characterController: CharacterController) {
        super(controller, new PartyConverter());
        this.characterController = characterController;
    }

    defineRoutes(app: Application): void {
        app.get(`/api/parties`, this.getByQuery);
        app.post(`/api/parties`, this.post);
        app.put(`/api/parties/:id`, this.post);
        app.get(`/api/parties/:id`, this.get);
    }

    private async get(req: Request, res: Response) {
        let params = req.params;
        let idStr: string = params.id;
        let id = StringUtility.getNumber(idStr);
        if (!id) {
            return res.status(400).json({data: null});
        }

        let vo = await this.controller.getById(id);
        return this.getOKResponse(res, vo);
    }

    private async post(req: Request, res: Response) {
        let vo = this.getBodyFromRequest(req);
        if (!vo) {
            return res.status(400).json({data: null});
        }

        vo = await this.controller.save(vo);
        if (!vo) {
            return res.status(400).json({data: null});
        }

        return this.getOKResponse(res, vo);
    }

    private async getByQuery(req: Request, res: Response) {
        let query: PartyQuery = this.parseQuery(req, ALL_PARTY_QUERY);
        let characterId: string = query.character_id;
        if (characterId != null) {
            let character = await this.characterController.getById(characterId);

            if (character == null || character.party == null) {
                return this.getOKResponse(res, null);
            }

            return this.getOKResponseMulti(res, [character.party]);
        }

        if (query.world_id != null) {
            let party = await this.controller.getByWorld(query.world_id);
            return this.getOKResponseMulti(res, party);
        }

        if (query.guild_id != null) {
            if (query.name != null) {
                let parties = await this.controller.getByNameAndGuild(query.name, query.guild_id);
                return this.getOKResponseMulti(res, parties);
            }

            let party = await this.controller.getByGuild(query.guild_id);
            return this.getOKResponseMulti(res, party);
        }

        return res.status(400).json({data: null});
    }
}