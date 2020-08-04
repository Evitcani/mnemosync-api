import {AbstractRoute} from "./AbstractRoute";
import {Application} from "express";
import {PartyFundController} from "../controllers/party/PartyFundController";
import {PartyFund} from "../entity/PartyFund";
import {inject, injectable} from "inversify";
import {TYPES} from "../../types";
import {PartyFundConverter} from "../../shared/models/converters/PartyFundConverter";

@injectable()
export class PartyFundRoute extends AbstractRoute<PartyFundController, PartyFundConverter, PartyFund> {
    constructor(@inject(TYPES.PartyFundController) specialChannelController: PartyFundController) {
        super(specialChannelController, new PartyFundConverter());
    }

    protected async controllerCreate(item: PartyFund): Promise<PartyFund> {
        return this.controller.updateFunds(item);
    }

    public defineRoutes(app: Application): void {

    }
}