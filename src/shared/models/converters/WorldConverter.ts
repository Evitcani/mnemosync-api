import {World} from "../../../backend/entity/World";
import {WorldDTO} from "@evitcani/mnemoshared/dist/src/dto/model/WorldDTO";
import {AbstractConverter} from "./AbstractConverter";
import {DTOType} from "@evitcani/mnemoshared/dist/src/dto/DTOType";
import {StringUtility} from "@evitcani/mnemoshared/dist/src/utilities/StringUtility";

export class WorldConverter extends AbstractConverter<World, WorldDTO> {
    public convertExistingVoToDto(vo: World, dto: WorldDTO): WorldDTO {
        if (!vo) {
            return null;
        }

        // Convert simple items.
        dto.id = vo.id;
        dto.createdDate = vo.createdDate;
        dto.updatedDate = vo.updatedDate;
        dto.guildId = vo.guildId;
        dto.mapUrl = vo.mapUrl;
        dto.name = vo.name;

        // Return
        return dto;
    }

    convertExistingDtoToVo(vo: World, dto: WorldDTO): World {
        if (!dto) {
            return null;
        }

        // Convert simple items.
        vo.id = StringUtility.escapeSQLInput(dto.id || null);
        vo.name = StringUtility.escapeSQLInput(dto.name || null);
        vo.guildId = StringUtility.escapeSQLInput(dto.guildId || null);
        vo.mapUrl = StringUtility.escapeSQLInput(dto.mapUrl || null);

        // Return
        return vo;
    }

    protected getNewDTO(): WorldDTO {
        return {dtoType: DTOType.WORLD};
    }

    protected getNewVO(): World {
        return new World();
    }
}