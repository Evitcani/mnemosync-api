import {AbstractRoute} from "./AbstractRoute";
import {Application, Request, Response} from "express";
import {PartyFundController} from "../controllers/party/PartyFundController";
import {PartyFund} from "../entity/PartyFund";
import {inject, injectable} from "inversify";
import {TYPES} from "../../types";
import {PartyFundConverter} from "../../shared/models/converters/PartyFundConverter";

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
            .post((req: Request, res:Response) => {

            })
            .get((req: Request, res:Response) => {

            });
        app.route(`${this.getBaseUrl()}/:id`)
            .put((req: Request, res:Response) => {
                let id = this.getNumberIdFromPath(req);
                if (!id) {
                    return this.sendBadRequestResponse(res);
                }

                return this.doBasicPost(req, res, id);
            })
            .get((req: Request, res:Response) => {

            });
    }
}