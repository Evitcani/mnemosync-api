import {AbstractRoute} from "./AbstractRoute";
import {CharacterController} from "../controllers/character/CharacterController";
import {inject, injectable} from "inversify";
import {TYPES} from "../../types";
import {Application, Request, Response} from "express";
import {Character} from "../entity/Character";
import {NicknameDTO} from "mnemoshared/dist/src/dto/model/NicknameDTO";
import {Nickname} from "../entity/Nickname";
import {ALL_CHARACTER_QUERY, CharacterQuery} from "mnemoshared/dist/src/models/queries/CharacterQuery";
import {CharacterConverter} from "../../shared/models/converters/CharacterConverter";
import {CharacterDTO} from "mnemoshared/dist/src/dto/model/CharacterDTO";
import {PartyController} from "../controllers/party/PartyController";
import {Party} from "../entity/Party";

@injectable()
export class CharacterRoute extends AbstractRoute<CharacterController, CharacterConverter, Character, CharacterDTO> {
    private partyController: PartyController;

    constructor(@inject(TYPES.CharacterController) characterController: CharacterController,
                @inject(TYPES.CharacterConverter) characterConverter: CharacterConverter,
                @inject(TYPES.PartyController) partyController: PartyController) {
        super(`characters`, characterController, characterConverter);
        this.partyController = partyController;
    }

    defineRoutes(app: Application): void {
        app.route(`${this.getBaseUrl()}`)
            .post((req, res) => {
                return this.doBasicPost(req, res);
            })
            .get((req, res) => {
                return this.getByQuery(req, res);
            });
        app.route(`${this.getBaseUrl()}/:id`)
            .get((req, res) => {
                return this.get(req, res);
            })
            .put((req, res) => {
                let idStr: string = this.getStringIdFromPath(req);
                if (!idStr) {
                    return this.sendBadRequestResponse(res);
                }

                return this.doBasicPost(req, res, idStr);
            })
            .post((req, res) => {
                return this.postNickname(req, res);
            });
    }

    /**
     * Processes the VO before saving. In the case of
     *
     * @param vo The VO to process.
     */
    protected async processVOBeforeSaving(vo: Character) {
        // The new world.
        let newWorld = vo.worldToCharacter;

        // If not null, there is a world to character that already exists. So we just want to update it.
        if (vo.id != null) {
            let worlds = await this.controller.getWorldToCharacterByCharacterId(vo.id);
            if (worlds != null && worlds.length > 0) {
                newWorld.id = worlds[0].id;
            }
        }

        // If there is no world ID, we want to get the world ID of the party. Otherwise, throw an error.
        if (newWorld.worldId == null) {
            if (newWorld.partyId == null) {
                console.error("ERR ::: Could not create character, no party ID given even though world is null.");
                throw new Error();
            }

            let party: Party = await this.partyController.getById(newWorld.partyId);
            if (party.worldId == null) {
                console.error("ERR ::: Could not create character, given party doesn't have world ID even though " +
                    "world to character world is null.");
                throw new Error();
            }

            newWorld.worldId = party.worldId;
        }

        // Do any other processing.
        await super.processVOBeforeSaving(vo);
    }

    protected async postNickname(req: Request, res: Response) {
        let idStr: string = this.getStringIdFromPath(req);
        if (!idStr) {
            return this.sendBadRequestResponse(res);
        }

        // @ts-ignore
        let dto: NicknameDTO = this.getBodyFromRequest(req, false);
        if (!dto) {
            return this.sendBadRequestResponse(res);
        }

        let vo: Nickname = this.converter.getNicknameConverter().convertDtoToVo(dto);
        vo = await this.controller.createNickname(vo);
        if (!vo) {
            return this.sendBadRequestResponse(res);
        }

        // @ts-ignore
        return this.sendOKResponse(res, vo);
    }

    protected async get(req: Request, res: Response) {
        let id = this.getStringIdFromPath(req);
        if (!id) {
            return this.sendBadRequestResponse(res);
        }

        let vo = await this.controller.getById(id);
        return this.sendOKResponse(res, vo);
    }

    private async getByQuery(req: Request, res: Response) {
        let query: CharacterQuery = this.parseQuery(req, ALL_CHARACTER_QUERY);

        let vo = await this.controller.getCharactersByParams(query);
        return this.sendOKResponseMulti(res, vo);
    }

    protected async controllerCreate(item: Character): Promise<Character> {
        if (!item ||
            !item.nicknames ||
            item.nicknames.length < 1) {
            return Promise.resolve(null);
        }
        return this.controller.save(item, item.nicknames[0].discordId);
    }
}