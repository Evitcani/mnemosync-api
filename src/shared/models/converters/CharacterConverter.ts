import {Character} from "../../../backend/entity/Character";
import {NicknameConverter} from "./NicknameConverter";
import {CharacterDTO} from "mnemoshared/dist/src/dto/model/CharacterDTO";
import {DTOType} from "mnemoshared/dist/src/dto/DTOType";
import {AbstractConverter} from "./AbstractConverter";
import {StringUtility} from "mnemoshared/dist/src/utilities/StringUtility";
import {inject, injectable} from "inversify";
import {TYPES} from "../../../types";

@injectable()
export class CharacterConverter extends AbstractConverter<Character, CharacterDTO> {
    private readonly nicknameConverter: NicknameConverter;

    constructor(@inject(TYPES.NicknameConverter) nicknameConverter: NicknameConverter) {
        super();
        this.nicknameConverter = nicknameConverter;
    }

    public getNicknameConverter(): NicknameConverter {
        return this.nicknameConverter;
    }

    public convertExistingVoToDto(vo: Character, dto: CharacterDTO): CharacterDTO {
        if (!vo) {
            return null;
        }

        // Convert simple items.
        dto.id = vo.id;
        dto.name = vo.name;
        dto.createdDate = vo.createdDate;
        dto.updatedDate = vo.updatedDate;
        dto.img_url = vo.imgUrl;

        // Convert nicknames.
        dto.nicknames = [];
        if (vo.nicknames != null && vo.nicknames.length > 0) {
            vo.nicknames.forEach((value) => {
                let nickname = this.nicknameConverter.convertVoToDto(value);
                if (nickname != null) {
                    dto.nicknames.push(nickname);
                }
            });
        }

        // Convert party.
        dto.partyId = vo.partyId;

        // Return
        return dto;
    }

    convertExistingDtoToVo(vo: Character, dto: CharacterDTO): Character {
        if (!dto) {
            return null;
        }

        vo.id = StringUtility.escapeSQLInput(dto.id);
        vo.name = StringUtility.escapeSQLInput(dto.name);
        vo.imgUrl = StringUtility.escapeSQLInput(dto.img_url);
        vo.partyId = this.checkNumber(dto.partyId);

        vo.nicknames = [];
        if (dto.nicknames != null && dto.nicknames.length > 0) {
            dto.nicknames.forEach((value) => {
                let nickname = this.nicknameConverter.convertDtoToVo(value);
                if (nickname != null) {
                    vo.nicknames.push(nickname);
                }
            });
        }

        return vo;
    }

    protected getNewDTO(): CharacterDTO {
        return {dtoType: DTOType.CHARACTER};
    }

    protected getNewVO(): Character {
        return new Character();
    }
}