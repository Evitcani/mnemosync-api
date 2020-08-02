import {Calendar} from "../../../../../../backend/entity/calendar/Calendar";
import {CalendarDTO} from "../../../model/calendar/CalendarDTO";
import {DateConverter} from "../DateConverter";
import {CalendarMoonDTO} from "../../../model/calendar/CalendarMoonDTO";
import {CalendarMoonPhaseDTO} from "../../../model/calendar/CalendarMoonPhaseDTO";
import {CalendarMoon} from "../../../../../../backend/entity/calendar/CalendarMoon";
import {CalendarMoonPhase} from "../../../../../../backend/entity/calendar/CalendarMoonPhase";
import {CalendarMonth} from "../../../../../../backend/entity/calendar/CalendarMonth";
import {CalendarMonthDTO} from "../../../model/calendar/CalendarMonthDTO";
import {CalendarEra} from "../../../../../../backend/entity/calendar/CalendarEra";
import {CalendarEraDTO} from "../../../model/calendar/CalendarEraDTO";
import {CalendarWeekDay} from "../../../../../../backend/entity/calendar/CalendarWeekDay";
import {CalendarWeekDayDTO} from "../../../model/calendar/CalendarWeekDayDTO";
import {WorldConverter} from "../WorldConverter";

export class CalendarConverter {
    public static convertVoToDto(vo: Calendar): CalendarDTO {
        return this.convertExistingVoToDto(vo, {});
    }

    public static convertExistingVoToDto(vo: Calendar, dto: CalendarDTO): CalendarDTO {
        if (!vo) {
            return null;
        }

        // Convert simple items.
        dto.id = vo.id;
        dto.createdDate = vo.createdDate;
        dto.updatedDate = vo.updatedDate;
        dto.name = vo.name;
        dto.description = vo.description;
        dto.yearLength = vo.yearLength;

        // Convert date.
        dto.epoch = {};
        DateConverter.convertExistingVoToDto(vo.epoch, dto.epoch);

        // Convert world.
        dto.world = {};
        dto.world.id = vo.worldId;
        WorldConverter.convertExistingVoToDto(vo.world, dto.world);

        // Convert week days.
        dto.week = [];
        if (vo.week != null && vo.week.length > 0) {
            vo.week.forEach((value) => {
                let item = this.convertWeekDayVoToDto(value);
                if (item != null) {
                    dto.week.push(item);
                }
            })
        }

        // Convert months.
        dto.months = [];
        if (vo.months != null && vo.months.length > 0) {
            vo.months.forEach((value) => {
                let item = this.convertMonthVoToDto(value);
                if (item != null) {
                    dto.months.push(item);
                }
            })
        }

        // Convert moons.
        dto.moons = [];
        if (vo.moons != null && vo.moons.length > 0) {
            vo.moons.forEach((value) => {
                let item = this.convertMoonVoToDto(value);
                if (item != null) {
                    dto.moons.push(item);
                }
            })
        }

        // Convert eras.
        dto.eras = [];
        if (vo.eras != null && vo.eras.length > 0) {
            vo.eras.forEach((value) => {
                let item = this.convertEraVoToDto(value);
                if (item != null) {
                    dto.eras.push(item);
                }
            })
        }

        // Return
        return dto;
    }

    protected static convertMonthVoToDto (vo: CalendarMonth): CalendarMonthDTO {
        if (!vo) {
            return null;
        }

        let dto: CalendarMonthDTO = {};

        dto.id = vo.id;
        dto.name = vo.name;
        dto.createdDate = vo.createdDate;
        dto.updatedDate = vo.updatedDate;
        dto.description = vo.description;
        dto.length = vo.length;
        dto.order = vo.order;

        return dto;
    }

    protected static convertEraVoToDto (vo: CalendarEra): CalendarEraDTO {
        if (!vo) {
            return null;
        }

        let dto: CalendarEraDTO = {};

        dto.id = vo.id;
        dto.name = vo.name;
        dto.createdDate = vo.createdDate;
        dto.updatedDate = vo.updatedDate;
        dto.order = vo.order;

        dto.start = {};
        DateConverter.convertExistingVoToDto(vo.start, dto.start);

        dto.end = {};
        DateConverter.convertExistingVoToDto(vo.end, dto.end);

        return dto;
    }

    protected static convertWeekDayVoToDto (vo: CalendarWeekDay): CalendarWeekDayDTO {
        if (!vo) {
            return null;
        }

        let dto: CalendarWeekDayDTO = {};

        dto.id = vo.id;
        dto.name = vo.name;
        dto.createdDate = vo.createdDate;
        dto.updatedDate = vo.updatedDate;
        dto.description = vo.description;
        dto.order = vo.order;

        return dto;
    }

    protected static convertMoonVoToDto (vo: CalendarMoon): CalendarMoonDTO {
        if (!vo) {
            return null;
        }

        let dto: CalendarMoonDTO = {};

        dto.id = vo.id;
        dto.name = vo.name;
        dto.createdDate = vo.createdDate;
        dto.updatedDate = vo.updatedDate;
        dto.cycle = vo.cycle;
        dto.description = vo.description;
        dto.shift = vo.shift;

        // Convert phases.
        dto.phases = [];
        if (vo.phases != null && vo.phases.length > 0) {
            vo.phases.forEach((value) => {
                let item = this.convertMoonPhaseVoToDto(value);
                if (item != null) {
                    dto.phases.push(item);
                }
            })
        }

        return dto;
    }

    protected static convertMoonPhaseVoToDto(vo: CalendarMoonPhase): CalendarMoonPhaseDTO {
        if (!vo) {
            return null;
        }

        let dto: CalendarMoonPhaseDTO = {};

        dto.id = vo.id;
        dto.name = vo.name;
        dto.createdDate = vo.createdDate;
        dto.updatedDate = vo.updatedDate;
        dto.order = vo.order;
        dto.viewingAngleEnd = vo.viewingAngleEnd;
        dto.viewingAngleStart = vo.viewingAngleEnd;

        return dto;
    }
}