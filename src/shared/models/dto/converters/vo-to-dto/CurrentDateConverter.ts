import {CurrentDate} from "../../../../../backend/entity/CurrentDate";
import {CalendarConverter} from "./calendars/CalendarConverter";
import {DateConverter} from "./DateConverter";
import {DTOType} from "@evitcani/mnemoshared/dist/src/dto/DTOType";
import {CurrentDateDTO} from "@evitcani/mnemoshared/dist/src/dto/model/CurrentDateDTO";
import {AbstractConverter} from "./AbstractConverter";

export class CurrentDateConverter extends AbstractConverter<CurrentDate, CurrentDateDTO> {
    private dateConverter: DateConverter;
    private calendarConverter: CalendarConverter;

    constructor() {
        super();
        this.dateConverter = new DateConverter();
        this.calendarConverter = new CalendarConverter();
    }

    public convertExistingVoToDto(vo: CurrentDate, dto: CurrentDateDTO): CurrentDateDTO {
        if (!vo) {
            return null;
        }

        // Convert simple items.
        dto.id = vo.id;
        dto.createdDate = vo.createdDate;
        dto.updatedDate = vo.updatedDate;

        // Convert date.
        dto.date = {dtoType: DTOType.DATE};
        dto.date.id = vo.date.id;
        this.dateConverter.convertExistingVoToDto(vo.date, dto.date);

        // Convert calendar.
        dto.calendar = {dtoType: DTOType.CALENDAR};
        dto.calendar.id = vo.calendarId;
        this.calendarConverter.convertExistingVoToDto(vo.calendar, dto.calendar);

        // Return
        return dto;
    }

    convertExistingDtoToVo(vo: CurrentDate, dto: CurrentDateDTO): CurrentDate {
        if (!dto) {
            return null;
        }

        // Convert simple items.
        dto.id = vo.id || null;

        // Convert date.
        vo.date = this.dateConverter.convertDtoToVo(dto.date) || null;
        vo.calendar = this.calendarConverter.convertDtoToVo(dto.calendar) || null;

        // Return
        return vo;
    }

    protected getNewDTO(): CurrentDateDTO {
        return {dtoType: DTOType.CURRENT_DATE};
    }

    protected getNewVO(): CurrentDate {
        return new CurrentDate();
    }
}