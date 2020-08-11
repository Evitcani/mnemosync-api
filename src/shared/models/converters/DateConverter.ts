import {GameDate} from "../../../backend/entity/GameDate";
import {DateDTO} from "mnemoshared/dist/src/dto/model/DateDTO";
import {AbstractConverter} from "./AbstractConverter";
import {DTOType} from "mnemoshared/dist/src/dto/DTOType";
import {StringUtility} from "mnemoshared/dist/src/utilities/StringUtility";
import {injectable} from "inversify";

@injectable()
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
        vo.id = StringUtility.escapeSQLInput(dto.id) || undefined;
        vo.recurrence = StringUtility.escapeSQLInput(dto.recurrence || null);
        vo.name = StringUtility.escapeSQLInput(dto.name || null);
        vo.description = StringUtility.escapeSQLInput(dto.description || null);
        vo.calendarId = StringUtility.escapeSQLInput(dto.calendarId || null);
        vo.eraId = StringUtility.escapeSQLInput(dto.eraId || null);
        vo.day = this.checkNumber(dto.day || 0);
        vo.month = this.checkNumber(dto.month || 0);
        vo.year = this.checkNumber(dto.year || 0);
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