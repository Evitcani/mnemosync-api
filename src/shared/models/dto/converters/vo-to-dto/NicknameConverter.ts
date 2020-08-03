import {Nickname} from "../../../../../backend/entity/Nickname";
import {NicknameDTO} from "@evitcani/mnemoshared/dist/src/dto/model/NicknameDTO";
import {DTOType} from "@evitcani/mnemoshared/dist/src/dto/DTOType";

export class NicknameConverter {
    public static convertVoToDto(vo: Nickname): NicknameDTO {
        return this.convertExistingVoToDto(vo, {dtoType: DTOType.NICKNAME});
    }

    public static convertExistingVoToDto(vo: Nickname, dto: NicknameDTO): NicknameDTO {
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
}