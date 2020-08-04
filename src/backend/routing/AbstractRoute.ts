import {injectable, unmanaged} from "inversify";
import {AbstractController} from "../controllers/Base/AbstractController";
import {Application, Request, Response} from "express";
import {DataDTO} from "@evitcani/mnemoshared/dist/src/dto/model/DataDTO";
import {StringUtility} from "@evitcani/mnemoshared/dist/src/utilities/StringUtility";
import {AbstractConverter} from "../../shared/models/converters/AbstractConverter";

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

    protected getOKResponse(res: Response, item: J)
    protected getOKResponse(res: Response, item: J, useConverter: boolean = true) {
        let ret = item;
        if (useConverter) {
            ret = this.converter.convertVoToDto(item)
        }
        return res.status(200).json({data: ret});
    }

    protected getOKResponseMulti(res: Response, items: J[])
    protected getOKResponseMulti(res: Response, items: J[], useConverter: boolean = true) {
        let dtos;
        if (!items || items.length < 1) {
            dtos = null
        } else {
            dtos = [];
            items.forEach((value) => {
                let val = value;
                if (useConverter) {
                    val = this.converter.convertVoToDto(value);
                }
                dtos.push(val);
            });
        }

        return res.status(200).json({data: dtos});
    }

    protected getBodyFromRequest(req: Request): J
    protected getBodyFromRequest(req: Request, useConverter: boolean): J
    protected getBodyFromRequest(req: Request, useConverter: boolean = true): J {
        let body: DataDTO = req.body;
        if (!req.body || !body.data || body.data.length <= 0) {
            console.log("No body in request.");
            return null;
        }

        let dto = body.data[0];
        let newObj;
        if (useConverter) {
            newObj = this.converter.convertDtoToVo(dto);
        } else {
            newObj = dto;
        }
        if (newObj == null) {
            console.log("Object would not be converted.");
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

    protected async doBasicPost(req: Request, res: Response, id?: any) {
        let vo = this.getBodyFromRequest(req);
        if (!vo) {
            return this.sendBadRequestResponse(res);
        }

        if (id) {
            // @ts-ignore
            vo.id = id;
        }

        vo = await this.controllerCreate(vo);
        if (!vo) {
            return this.sendBadRequestResponse(res);
        }

        return this.getOKResponse(res, vo);
    }

    protected abstract async controllerCreate(item: J): Promise<J>;

    protected getStringIdFromPath(req: Request): string {
        let params = req.params;
        let idStr: string = params.id;
        if (!idStr) {
            return null
        }

        return idStr;
    }

    protected getNumberIdFromPath(req): number {
        let idStr = this.getStringIdFromPath(req);
        if (!idStr) {
            return null;
        }

        let id = StringUtility.getNumber(idStr);
        if (!id) {
            return null;
        }

        return id;
    }

    protected sendBadRequestResponse(res: Response) {
        return res.status(400).json({data: null});
    }
}