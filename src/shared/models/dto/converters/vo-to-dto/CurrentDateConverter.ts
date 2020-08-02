import {CurrentDate} from "../../../../../backend/entity/CurrentDate";
import {CurrentDateDTO} from "../../model/CurrentDateDTO";
import {CalendarConverter} from "./calendars/CalendarConverter";
import {DateConverter} from "./DateConverter";
import {DTOType} from "../../DTOType";

export class CurrentDateConverter {
    public static convertVoToDto(vo: CurrentDate): CurrentDateDTO {
        return this.convertExistingVoToDto(vo, {dtoType: DTOType.CURRENT_DATE});
    }

    public static convertExistingVoToDto(vo: CurrentDate, dto: CurrentDateDTO): CurrentDateDTO {
        if (!vo) {
            return null;
        }

        // Convert simple items.
        dto.id = vo.id;
        dto.createdDate = vo.createdDate;
        dto.updatedDate = vo.updatedDate;

        // Convert date.
        dto.date = {dtoType: DTOType.DATE};
        DateConverter.convertExistingVoToDto(vo.date, dto.date);

        // Convert calendar.
        dto.calendar = {dtoType: DTOType.CALENDAR};
        dto.calendar.id = vo.calendarId;
        CalendarConverter.convertExistingVoToDto(vo.calendar, dto.calendar);

        // Return
        return dto;
    }
}