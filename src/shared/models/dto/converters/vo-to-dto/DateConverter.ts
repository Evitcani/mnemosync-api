import {GameDate} from "../../../../../backend/entity/GameDate";
import {DateDTO} from "@evitcani/mnemoshared/dist/src/dto/model/DateDTO";
import {AbstractConverter} from "./AbstractConverter";
import {DTOType} from "@evitcani/mnemoshared/dist/src/dto/DTOType";

export class DateConverter extends AbstractConverter<GameDate, DateDTO> {

    public convertExistingVoToDto(vo: GameDate, dto: DateDTO): DateDTO {
        if (!vo) {
            return null;
        }

        // Convert simple items.
        dto.id = vo.id;
        dto.recurrence = vo.recurrence;
        dto.name = vo.name;
        dto.description = vo.description;
        dto.calendarId = vo.calendarId;
        dto.eraId = vo.eraId;
        dto.day = vo.day;
        dto.month = vo.month;
        dto.year = vo.year;

        // Return
        return dto;
    }

    convertExistingDtoToVo(vo: GameDate, dto: DateDTO): GameDate {
        if (!dto) {
            return null;
        }

        // Convert simple items.
        vo.id = dto.id || null;
        vo.recurrence = dto.recurrence || null;
        vo.name = dto.name || null;
        vo.description = dto.description || null;
        vo.calendarId = dto.calendarId || null;
        vo.eraId = dto.eraId || null;
        vo.day = dto.day || null;
        vo.month = dto.month || null;
        vo.year = dto.year || null;
        vo.significant = dto.significant || false;

        // Return
        return vo;
    }

    protected getNewDTO(): DateDTO {
        return {dtoType: DTOType.DATE};
    }

    protected getNewVO(): GameDate {
        return new GameDate();
    }
}