import {Nickname} from "../../../backend/entity/Nickname";
import {NicknameDTO} from "mnemoshared/dist/src/dto/model/NicknameDTO";
import {DTOType} from "mnemoshared/dist/src/dto/DTOType";
import {AbstractConverter} from "./AbstractConverter";
import {StringUtility} from "mnemoshared/dist/src/utilities/StringUtility";
import {injectable} from "inversify";

@injectable()
export class NicknameConverter extends AbstractConverter<Nickname, NicknameDTO> {
    public convertExistingVoToDto(vo: Nickname, dto: NicknameDTO): NicknameDTO {
        if (!vo) {
            return null;
        }

        // Convert simple items.
        dto.id = vo.id;
        dto.createdDate = vo.createdDate;
        dto.updatedDate = vo.updatedDate;
        dto.name = vo.name;
        dto.characterId = vo.characterId;

        // Return
        return dto;
    }

    convertExistingDtoToVo(vo: Nickname, dto: NicknameDTO): Nickname {
        if (!dto) {
            return null;
        }

        // Convert simple items.
        vo.id = StringUtility.escapeSQLInput(dto.id) || undefined;
        vo.name = StringUtility.escapeSQLInput(dto.name || null);
        vo.characterId = StringUtility.escapeSQLInput(dto.characterId || null);
        vo.discordId = StringUtility.escapeSQLInput(dto.discordId || null);

        // Return
        return vo;
    }

    protected getNewDTO(): NicknameDTO {
        return {dtoType: DTOType.NICKNAME};
    }

    protected getNewVO(): Nickname {
        return new Nickname();
    }
}