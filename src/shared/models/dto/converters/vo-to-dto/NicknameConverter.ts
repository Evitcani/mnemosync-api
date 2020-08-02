import {Nickname} from "../../../../../backend/entity/Nickname";
import {NicknameDTO} from "../../model/NicknameDTO";

export class NicknameConverter {
    public static convertVoToDto(vo: Nickname): NicknameDTO {
        return this.convertExistingVoToDto(vo, {});
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
        dto.discordId = vo.discord_id;

        // Return
        return dto;
    }
}