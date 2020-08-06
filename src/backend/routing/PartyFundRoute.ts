import {AbstractRoute} from "./AbstractRoute";
import {Application, Request, Response} from "express";
import {PartyFundController} from "../controllers/party/PartyFundController";
import {PartyFund} from "../entity/PartyFund";
import {inject, injectable} from "inversify";
import {TYPES} from "../../types";
import {PartyFundConverter} from "../../shared/models/converters/PartyFundConverter";
import {ALL_PARTY_FUND_QUERY, PartyFundQuery} from "@evitcani/mnemoshared/dist/src/models/queries/PartyFundQuery";

@injectable()
export class PartyFundRoute extends AbstractRoute<PartyFundController, PartyFundConverter, PartyFund> {
    constructor(@inject(TYPES.PartyFundController) specialChannelController: PartyFundController) {
        super(`parties/:party_id/funds`, specialChannelController, new PartyFundConverter());
    }

    protected async controllerCreate(item: PartyFund): Promise<PartyFund> {
        return this.controller.updateFunds(item);
    }

    public defineRoutes(app: Application): void {
        app.route(`${this.getBaseUrl()}`)
            .post((req: Request, res: Response) => {
                return this.createFund(req, res);
            })
            .get((req: Request, res: Response) => {
                return this.getFund(req, res);
            });
        app.route(`${this.getBaseUrl()}/:id`)
            .put((req: Request, res: Response) => {
                let id = this.getNumberIdFromPath(req);
                if (!id) {
                    return this.sendBadRequestResponse(res);
                }

                return this.doBasicPost(req, res, id);
            })
            .get((req: Request, res: Response) => {
                return this.getById(req, res);
            });
    }

    private async getById(req: Request, res: Response) {
        let id = this.getNumberIdFromPath(req);
        if (!id) {
            return this.sendBadRequestResponse(res);
        }

        let fund = await this.controller.getById(id);
        return this.sendOKResponse(res, fund);
    }

    private async createFund(req: Request, res: Response) {
        let partyId = this.getNumberIdFromPath(req, `party_id`);
        if (!partyId) {
            return this.sendBadRequestResponse(res);
        }

        let partyFund = this.getBodyFromRequest(req);

        partyFund = await this.controller.create(partyId, partyFund.type);
        return this.sendOKResponse(res, partyFund);
    }

    private async getFund(req: Request, res: Response) {
        let partyId = this.getNumberIdFromPath(req, `party_id`);
        if (!partyId) {
            return this.sendBadRequestResponse(res);
        }

        let query: PartyFundQuery = this.parseQuery(req, ALL_PARTY_FUND_QUERY);
        if (!query.type) {
            return this.sendBadRequestResponse(res);
        }

        let fund = await this.controller.getByPartyAndType(partyId, query.type);
        return this.sendOKResponseMulti(res, [fund]);
    }
}