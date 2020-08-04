import {Nickname} from "../../../../../backend/entity/Nickname";
import {NicknameDTO} from "@evitcani/mnemoshared/dist/src/dto/model/NicknameDTO";
import {DTOType} from "@evitcani/mnemoshared/dist/src/dto/DTOType";
import {AbstractConverter} from "./AbstractConverter";

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
        vo.id = dto.id || null;
        vo.name = dto.name || null;
        vo.characterId = dto.characterId || null;
        vo.discordId = dto.discordId || null;

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