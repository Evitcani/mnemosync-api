import {AbstractRoute} from "./AbstractRoute";
import {Application} from "express";
import {PartyFundController} from "../controllers/party/PartyFundController";
import {PartyFundConverter} from "../../shared/models/dto/converters/vo-to-dto/PartyFundConverter";
import {PartyFund} from "../entity/PartyFund";
import {inject, injectable} from "inversify";
import {TYPES} from "../../types";
import {SpecialChannelController} from "../controllers/user/SpecialChannelController";
import {SpecialChannelConverter} from "../../shared/models/dto/converters/vo-to-dto/SpecialChannelConverter";

@injectable()
export class PartyFundRoute extends AbstractRoute<PartyFundController, PartyFundConverter, PartyFund> {
    constructor(@inject(TYPES.PartyFundController) specialChannelController: PartyFundController) {
        super(specialChannelController, new PartyFundConverter());
    }

    protected async controllerCreate(item: PartyFund): Promise<PartyFund> {
        return this.controller.updateFunds(item);
    }

    defineRoutes(app: Application): void {

    }
}