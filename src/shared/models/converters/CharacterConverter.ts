import {Character} from "../../../backend/entity/Character";
import {NicknameConverter} from "./NicknameConverter";
import {CharacterDTO} from "mnemoshared/dist/src/dto/model/CharacterDTO";
import {DTOType} from "mnemoshared/dist/src/dto/DTOType";
import {AbstractConverter} from "./AbstractConverter";
import {StringUtility} from "mnemoshared/dist/src/utilities/StringUtility";
import {inject, injectable} from "inversify";
import {TYPES} from "../../../types";
import {WorldToCharacterConverter} from "./WorldToCharacterConverter";

@injectable()
export class CharacterConverter extends AbstractConverter<Character, CharacterDTO> {
    private readonly nicknameConverter: NicknameConverter;
    private readonly worldToCharacterConverter: WorldToCharacterConverter;

    constructor(@inject(TYPES.NicknameConverter) nicknameConverter: NicknameConverter,
                @inject(TYPES.WorldToCharacterConverter) worldToCharacterConverter: WorldToCharacterConverter) {
        super();
        this.nicknameConverter = nicknameConverter;
        this.worldToCharacterConverter = worldToCharacterConverter;
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

        dto.worldToCharacter = this.worldToCharacterConverter.convertVoToDto(vo.worldToCharacter);

        // Return
        return dto;
    }

    convertExistingDtoToVo(vo: Character, dto: CharacterDTO): Character {
        if (!dto) {
            return null;
        }

        vo.id = StringUtility.escapeSQLInput(dto.id);
        vo.imgUrl = StringUtility.escapeSQLInput(dto.img_url);

        vo.nicknames = [];
        if (dto.nicknames != null && dto.nicknames.length > 0) {
            dto.nicknames.forEach((value) => {
                let nickname = this.nicknameConverter.convertDtoToVo(value);
                if (nickname != null) {
                    vo.nicknames.push(nickname);
                }
            });
        }

        vo.worldToCharacter = this.worldToCharacterConverter.convertDtoToVo(dto.worldToCharacter);

        return vo;
    }

    protected getNewDTO(): CharacterDTO {
        return {dtoType: DTOType.CHARACTER};
    }

    protected getNewVO(): Character {
        return new Character();
    }
}