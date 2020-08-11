import {AbstractRoute} from "./AbstractRoute";
import {Application, Request, Response} from "express";
import {SendingController} from "../controllers/character/SendingController";
import {Sending} from "../entity/Sending";
import {inject, injectable} from "inversify";
import {TYPES} from "../../types";
import {SendingConverter} from "../../shared/models/converters/SendingConverter";
import {SendingDTO} from "mnemoshared/dist/src/dto/model/SendingDTO";
import {ALL_SENDING_QUERY, SendingQuery} from "mnemoshared/dist/src/models/queries/SendingQuery";

@injectable()
export class SendingRoute extends AbstractRoute<SendingController, SendingConverter, Sending, SendingDTO> {
    constructor(@inject(TYPES.SendingController) sendingController: SendingController,
                @inject(TYPES.SendingConverter) sendingConverter: SendingConverter) {
        super(`sendings`, sendingController, sendingConverter);
    }

    protected async controllerCreate(item: Sending): Promise<Sending> {
        return this.controller.save(item);
    }

    public defineRoutes(app: Application): void {
        app.route(`${this.getBaseUrl()}`)
            .get((req: Request, res: Response) => {
                return this.getByQuery(req, res);
            })
            .post((req: Request, res: Response) => {
                return this.doBasicPost(req, res).catch((err) => {
                    console.log(err);
                    return null;
                });
            });
        app.route(`${this.getBaseUrl()}/:id`)
            .put((req: Request, res: Response) => {
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
        let id = this.getStringIdFromPath(req);
        if (!id) {
            return this.sendBadRequestResponse(res);
        }

        let vo = await this.controller.getById(id);
        return this.sendOKResponse(res, vo);
    }

    public async getByQuery(req: Request, res: Response) {
        let query: SendingQuery = this.parseQuery(req, ALL_SENDING_QUERY);

        let sendings = await this.controller.getByParams(query);
        return this.sendOKResponseMulti(res, sendings);
    }
}