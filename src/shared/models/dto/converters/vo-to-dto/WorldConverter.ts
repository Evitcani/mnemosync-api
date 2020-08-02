import {World} from "../../../../../backend/entity/World";
import {WorldDTO} from "@evitcani/mnemoshared/dist/src/dto/model/WorldDTO";
import {DTOType} from "@evitcani/mnemoshared/dist/src/dto/DTOType";

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