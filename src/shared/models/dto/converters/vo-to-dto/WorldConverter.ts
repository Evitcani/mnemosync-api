import {WorldDTO} from "../../model/WorldDTO";
import {World} from "../../../../../backend/entity/World";
import {DTOType} from "../../DTOType";

export class WorldConverter {
    public static convertVoToDto(vo: World): WorldDTO {
        return this.convertExistingVoToDto(vo, {dtoType: DTOType.WORLD});
    }

    public static convertExistingVoToDto(vo: World, dto: WorldDTO): WorldDTO {
        if (!vo) {
            return null;
        }

        // Convert simple items.
        dto.id = vo.id;
        dto.createdDate = vo.createdDate;
        dto.updatedDate = vo.updatedDate;
        dto.guildId = vo.guildId;
        dto.mapUrl = vo.mapUrl;

        // Return
        return dto;
    }
}