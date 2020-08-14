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

        let parties = new Map<number, Party>();
        if (query.character_id != null) {
            let pts = await this.characterController.getPartyByCharacterId(query.character_id);

            if (pts != null && pts.length > 0) {
                pts.forEach((pt) => {
                    parties.set(pt.id, pt);
                });
            }
        }

        let pts = await this.controller.getByParameters(query);
        if (pts != null && pts.length > 0) {
            pts.forEach((pt) => {
                parties.set(pt.id, pt);
            });
        }

        return this.sendOKResponseMulti(res, parties.size <= 0 ? null : Array.from(parties.values()))
    }

    protected async controllerCreate(item: Party): Promise<Party> {
        return this.controller.save(item);
    }
}