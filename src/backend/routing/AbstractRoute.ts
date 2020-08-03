import {injectable, unmanaged} from "inversify";
import {AbstractController} from "../controllers/Base/AbstractController";
import {Application, Request, Response} from "express";
import {AbstractConverter} from "../../shared/models/dto/converters/vo-to-dto/AbstractConverter";
import {DataDTO} from "@evitcani/mnemoshared/dist/src/dto/model/DataDTO";
import {UserDTO} from "@evitcani/mnemoshared/dist/src/dto/model/UserDTO";

@injectable()
export abstract class AbstractRoute<T extends AbstractController<any>, U extends AbstractConverter<any, any>, J> {
    protected controller: T;
    protected converter: U;

    protected constructor(@unmanaged() controller: T,
                          @unmanaged() converter: U) {
        this.controller = controller;
        this.converter = converter;
    }

    public abstract defineRoutes(app: Application): void;

    protected getOKResponse(res: Response, item: J) {
        return res.status(200).json({data: this.converter.convertVoToDto(item)});
    }

    protected getOKResponseMulti(res: Response, items: J[]) {
        let dtos = [];
        items.forEach((value) => {
            dtos.push(this.converter.convertVoToDto(value));
        });

        return res.status(200).json({data: dtos});
    }

    protected getBodyFromRequest(req: Request): J {
        let body: DataDTO = req.body;
        if (!req.body || !body.data || body.data.length <= 0) {
            return null;
        }

        let dto: UserDTO = body.data[0];
        let newObj = this.converter.convertDtoToVo(dto);
        if (newObj == null) {
            return null;
        }

        return newObj;
    }

    protected parseQuery(req: Request, allowedParams: string[]) {
        if (!allowedParams) {
            return null;
        }

        let params = {};
        allowedParams.forEach((value) => {
            let val = req.query[value];
            params[value] = val || null;
        });

        return params;
    }
}