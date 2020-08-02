import {GameDate} from "../../../../../backend/entity/GameDate";
import {DateDTO} from "@evitcani/mnemoshared/dist/src/dto/model/DateDTO";
import {DTOType} from "@evitcani/mnemoshared/dist/src/dto/DTOType";

export class DateConverter {
    public static convertVoToDto(vo: GameDate): DateDTO {
        return this.convertExistingVoToDto(vo, {dtoType: DTOType.DATE});
    }

    public static convertExistingVoToDto(vo: GameDate, dto: DateDTO): DateDTO {
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
}