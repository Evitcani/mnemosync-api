import {CurrentDate} from "../../../backend/entity/CurrentDate";
import {CalendarConverter} from "./CalendarConverter";
import {DateConverter} from "./DateConverter";
import {DTOType} from "mnemoshared/dist/src/dto/DTOType";
import {CurrentDateDTO} from "mnemoshared/dist/src/dto/model/CurrentDateDTO";
import {AbstractConverter} from "./AbstractConverter";
import {StringUtility} from "mnemoshared/dist/src/utilities/StringUtility";
import {inject, injectable} from "inversify";
import {TYPES} from "../../../types";

/**
 * Converts the current date object.
 */
@injectable()
export class CurrentDateConverter extends AbstractConverter<CurrentDate, CurrentDateDTO> {
    /** Used to convert a date. */
    private dateConverter: DateConverter;
    private calendarConverter: CalendarConverter;

    constructor(@inject(TYPES.CalendarConverter) calendarConverter: CalendarConverter,
                @inject(TYPES.DateConverter) dateConverter: DateConverter) {
        super();
        this.dateConverter = dateConverter;
        this.calendarConverter = calendarConverter;
    }

    public convertExistingVoToDto(vo: CurrentDate, dto: CurrentDateDTO): CurrentDateDTO | null {
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

    /**
     * Converts the VO to DTO.
     *
     * @param vo The VO to convert.
     * @param dto The DTO to convert.
     */
    convertExistingDtoToVo(vo: CurrentDate, dto: CurrentDateDTO): CurrentDate | null {
        if (!dto) {
            return null;
        }

        // Convert simple items.
        vo.id = StringUtility.escapeSQLInput(dto.id) || undefined;

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