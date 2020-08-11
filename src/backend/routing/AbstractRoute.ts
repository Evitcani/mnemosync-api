import {injectable, unmanaged} from "inversify";
import {AbstractController} from "../controllers/Base/AbstractController";
import {Application, Request, Response} from "express";
import {DataDTO} from "mnemoshared/dist/src/dto/model/DataDTO";
import {StringUtility} from "mnemoshared/dist/src/utilities/StringUtility";
import {AbstractConverter} from "../../shared/models/converters/AbstractConverter";

/**
 * Underlies most routing to make things easier.
 */
@injectable()
export abstract class AbstractRoute<T extends AbstractController<any>, U extends AbstractConverter<any, any>, J, V> {
    protected static BASE_PREFIX = "/api";
    protected baseUrl: string;
    /** The main controller to the database service. */
    protected controller: T;
    /** The converter used to move things to or from DTO and VO. */
    protected converter: U;

    /**
     * Constructs a basic instance of this.
     *
     * @param baseUrl
     * @param controller The main controller to the database service.
     * @param converter The converter used to move things to or from DTO and VO.
     */
    protected constructor(@unmanaged() baseUrl: string,
                          @unmanaged() controller: T,
                          @unmanaged() converter: U) {
        this.baseUrl = baseUrl;
        this.controller = controller;
        this.converter = converter;
    }

    /**
     * Defines the routes in the application.
     *
     * @param app The app to define the routes on.
     */
    public abstract defineRoutes(app: Application): void;

    /**
     * Method to use when creating or updating the object.
     *
     * @param item The item to create or update.
     */
    protected abstract async controllerCreate(item: J): Promise<J>;

    /**
     * Gets the appropriate base URL for this routing device.
     */
    protected getBaseUrl(): string {
        return `${AbstractRoute.BASE_PREFIX}/${this.baseUrl}`;
    }

    /**
     * Sends an OK response and transforms the item using the converter.
     *
     * @param res The response to use for sending back.
     * @param item The item to convert.
     * @param useConverter True to use the converter on this item, false otherwise.
     */
    protected sendOKResponse(res: Response, item: J, useConverter?: boolean): Response
    protected sendOKResponse(res: Response, item: J, useConverter: boolean = true): Response {
        let ret = item;
        if (useConverter) {
            ret = this.converter.convertVoToDto(item)
        }
        return res.status(200).json({data: ret});
    }

    /**
     * Sends an OK response with multiple entries in an array of data.
     *
     * @param res The response to use for sending back.
     * @param items The items to send back.
     * @param useConverter True to use the converter, false otherwise.
     */
    protected sendOKResponseMulti(res: Response, items: J[], useConverter?: boolean): Response
    protected sendOKResponseMulti(res: Response, items: J[], useConverter: boolean = true): Response {
        let dtos;
        if (items == null || items.length < 1) {
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

    /**
     * Sends a 400 Bad Request response back.
     * @param res
     */
    protected sendBadRequestResponse(res: Response): Response {
        return res.status(400).json({data: null});
    }

    /**
     * Gets the body from the request.
     *
     * @param req The request to get the body from.
     * @param useConverter True to use the converter, false otherwise.
     */
    protected getBodyFromRequest(req: Request, useConverter?: boolean): J
    protected getBodyFromRequest(req: Request, useConverter: boolean = true): J {
        let body: DataDTO = req.body == null ? null : req.body.data;
        if (body == null || body.data == null || body.data.length <= 0) {
            return null;
        }

        let dto: V = body.data[0];

        let newObj;
        if (useConverter && this.converter != null) {
            newObj = this.converter.convertDtoToVo(dto);
        } else {
            newObj = dto;
        }
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

    protected async doBasicPost(req: Request, res: Response, id?: any, path?: string)
    protected async doBasicPost(req: Request, res: Response, id?: any, path: string = "id") {
        let vo = this.getBodyFromRequest(req);
        if (!vo) {
            return this.sendBadRequestResponse(res);
        }

        if (id) {
            // @ts-ignore
            vo[path] = id;
        }

        vo = await this.controllerCreate(vo);
        if (!vo) {
            return this.sendBadRequestResponse(res);
        }

        return this.sendOKResponse(res, vo);
    }

    protected getStringIdFromPath(req: Request, path?: string): string
    protected getStringIdFromPath(req: Request, path: string = "id"): string {
        let params = req.params;
        let idStr: string = params[path];
        if (!idStr) {
            return null
        }

        return idStr;
    }

    protected getNumberIdFromPath(req, path?: string): number {
        let idStr = this.getStringIdFromPath(req, path);
        if (!idStr) {
            return null;
        }

        let id = StringUtility.getNumber(idStr);
        if (!id) {
            return null;
        }

        return id;
    }
}