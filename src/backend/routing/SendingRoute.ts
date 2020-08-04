import {AbstractRoute} from "./AbstractRoute";
import {Application} from "express";
import {SendingController} from "../controllers/character/SendingController";
import {Sending} from "../entity/Sending";
import {inject, injectable} from "inversify";
import {TYPES} from "../../types";
import {SendingConverter} from "../../shared/models/converters/SendingConverter";

@injectable()
export class SendingRoute extends AbstractRoute<SendingController, SendingConverter, Sending> {
    constructor(@inject(TYPES.SendingController) sendingController: SendingController) {
        super(sendingController, new SendingConverter());
    }

    protected async controllerCreate(item: Sending): Promise<Sending> {
        return this.controller.save(item);
    }

    defineRoutes(app: Application): void {

    }
}