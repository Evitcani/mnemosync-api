import {Calendar} from "../../../backend/entity/calendar/Calendar";
import {DateConverter} from "./DateConverter";
import {CalendarMoon} from "../../../backend/entity/calendar/CalendarMoon";
import {CalendarMoonPhase} from "../../../backend/entity/calendar/CalendarMoonPhase";
import {CalendarMonth} from "../../../backend/entity/calendar/CalendarMonth";
import {CalendarEra} from "../../../backend/entity/calendar/CalendarEra";
import {CalendarWeekDay} from "../../../backend/entity/calendar/CalendarWeekDay";
import {DTOType} from "@evitcani/mnemoshared/dist/src/dto/DTOType";
import {CalendarDTO} from "@evitcani/mnemoshared/dist/src/dto/model/calendar/CalendarDTO";
import {CalendarMonthDTO} from "@evitcani/mnemoshared/dist/src/dto/model/calendar/CalendarMonthDTO";
import {CalendarEraDTO} from "@evitcani/mnemoshared/dist/src/dto/model/calendar/CalendarEraDTO";
import {CalendarWeekDayDTO} from "@evitcani/mnemoshared/dist/src/dto/model/calendar/CalendarWeekDayDTO";
import {CalendarMoonDTO} from "@evitcani/mnemoshared/dist/src/dto/model/calendar/CalendarMoonDTO";
import {CalendarMoonPhaseDTO} from "@evitcani/mnemoshared/dist/src/dto/model/calendar/CalendarMoonPhaseDTO";
import {AbstractConverter} from "./AbstractConverter";
import {StringUtility} from "@evitcani/mnemoshared/dist/src/utilities/StringUtility";
import {inject, injectable} from "inversify";
import {TYPES} from "../../../types";

@injectable()
export class CalendarConverter extends AbstractConverter<Calendar, CalendarDTO> {
    private dateConverter: DateConverter;

    constructor(@inject(TYPES.DateConverter) dateConverter: DateConverter) {
        super();
        this.dateConverter = dateConverter;
    }

    public convertExistingVoToDto(vo: Calendar, dto: CalendarDTO): CalendarDTO {
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
        if (vo.epoch != null) {
            dto.epoch = {dtoType: DTOType.DATE};
            dto.epoch.id = vo.epoch.id;
            this.dateConverter.convertExistingVoToDto(vo.epoch, dto.epoch);
        }

        // Convert world.
        dto.worldId = vo.worldId;

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

    public convertExistingDtoToVo(vo: Calendar, dto: CalendarDTO): Calendar {
        if (!dto) {
            return null;
        }

        vo.id = StringUtility.escapeSQLInput(dto.id) || undefined;
        vo.name = StringUtility.escapeSQLInput(dto.name || null);
        vo.description = StringUtility.escapeSQLInput(dto.description || null);
        vo.yearLength = this.checkNumber(dto.yearLength || 0);

        // Convert date.
        if (dto.epoch != null) {
            vo.epoch = this.dateConverter.convertDtoToVo(dto.epoch);
        } else {
            vo.epoch = null;
        }

        // Convert world.
        vo.worldId = StringUtility.escapeSQLInput(dto.worldId || null);

        // Convert week days.
        vo.week = [];
        if (dto.week != null && dto.week.length > 0) {
            dto.week.forEach((value) => {
                let item = this.convertWeekDayDtoToVo(value);
                if (item != null) {
                    vo.week.push(item);
                }
            })
        } else {
            vo.week = null;
        }

        // Convert months.
        vo.months = [];
        if (dto.months != null && dto.months.length > 0) {
            dto.months.forEach((value) => {
                let item = this.convertMonthDtoToVo(value);
                if (item != null) {
                    vo.months.push(item);
                }
            })
        } else {
            vo.months = null;
        }

        // Convert moons.
        vo.moons = [];
        if (dto.moons != null && dto.moons.length > 0) {
            dto.moons.forEach((value) => {
                let item = this.convertMoonDtoToVo(value);
                if (item != null) {
                    vo.moons.push(item);
                }
            })
        } else {
            vo.moons = null;
        }

        // Convert eras.
        vo.eras = [];
        if (dto.eras != null && dto.eras.length > 0) {
            dto.eras.forEach((value) => {
                let item = this.convertEraDtoToVo(value);
                if (item != null) {
                    vo.eras.push(item);
                }
            })
        } else {
            vo.eras = null;
        }

        return vo;
    }
    protected getNewDTO(): CalendarDTO {
        return {dtoType: DTOType.CALENDAR};
    }
    protected getNewVO(): Calendar {
        return new Calendar();
    }

    protected convertMonthVoToDto (vo: CalendarMonth): CalendarMonthDTO {
        if (!vo) {
            return null;
        }

        let dto: CalendarMonthDTO = {dtoType: DTOType.CALENDAR_MONTH};

        dto.id = vo.id;
        dto.name = vo.name;
        dto.createdDate = vo.createdDate;
        dto.updatedDate = vo.updatedDate;
        dto.description = vo.description;
        dto.length = vo.length;
        dto.order = vo.order;

        return dto;
    }

    protected convertMonthDtoToVo (dto: CalendarMonthDTO): CalendarMonth {
        if (!dto) {
            return null;
        }

        let vo = new CalendarMonth();

        vo.id = StringUtility.escapeSQLInput(dto.id) || undefined;
        vo.name = StringUtility.escapeSQLInput(dto.name || null);
        vo.description = StringUtility.escapeSQLInput(dto.description || null);
        vo.length = this.checkNumber(dto.length || 0);
        vo.order = this.checkNumber(dto.order || 0);

        return vo;
    }

    protected convertEraVoToDto (vo: CalendarEra): CalendarEraDTO {
        if (!vo) {
            return null;
        }

        let dto: CalendarEraDTO = {dtoType: DTOType.CALENDAR_ERA};

        dto.id = vo.id;
        dto.name = vo.name;
        dto.createdDate = vo.createdDate;
        dto.updatedDate = vo.updatedDate;
        dto.order = vo.order;

        if (dto.start != null) {
            dto.start = {dtoType: DTOType.DATE};
            dto.start.id = vo.start.id;
            this.dateConverter.convertExistingVoToDto(vo.start, dto.start);
        }

        if (vo.end != null) {
            dto.end = {dtoType: DTOType.DATE};
            dto.end.id = vo.end.id;
            this.dateConverter.convertExistingVoToDto(vo.end, dto.end);
        }

        return dto;
    }

    protected convertEraDtoToVo (dto: CalendarEraDTO): CalendarEra {
        if (!dto) {
            return null;
        }

        let vo = new CalendarEra();

        vo.id = StringUtility.escapeSQLInput(dto.id) || undefined;
        vo.name = StringUtility.escapeSQLInput(dto.name || null);
        vo.order = this.checkNumber(dto.order || 0);

        if (!dto.start) {
            vo.start = this.dateConverter.convertDtoToVo(dto.start);
        } else {
            vo.start = null;
        }

        if (!vo.end) {
            vo.end = this.dateConverter.convertDtoToVo(dto.end);
        } else {
            vo.end = null;
        }

        return vo;
    }

    protected convertWeekDayVoToDto (vo: CalendarWeekDay): CalendarWeekDayDTO {
        if (!vo) {
            return null;
        }

        let dto: CalendarWeekDayDTO = {dtoType: DTOType.CALENDAR_WEEK_DAY};

        dto.id = vo.id;
        dto.name = vo.name;
        dto.createdDate = vo.createdDate;
        dto.updatedDate = vo.updatedDate;
        dto.description = vo.description;
        dto.order = vo.order;

        return dto;
    }

    protected convertWeekDayDtoToVo (dto: CalendarWeekDayDTO): CalendarWeekDay {
        if (!dto) {
            return null;
        }

        let vo = new CalendarWeekDay();

        vo.id = StringUtility.escapeSQLInput(dto.id) || undefined;
        vo.name = StringUtility.escapeSQLInput(dto.name || null);
        vo.description = StringUtility.escapeSQLInput(dto.description || null);
        vo.order = this.checkNumber(dto.order || 0);

        return vo;
    }

    protected convertMoonVoToDto (vo: CalendarMoon): CalendarMoonDTO {
        if (!vo) {
            return null;
        }

        let dto: CalendarMoonDTO = {dtoType: DTOType.CALENDAR_MOON};

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

    protected convertMoonDtoToVo (dto: CalendarMoonDTO): CalendarMoon {
        if (!dto) {
            return null;
        }

        let vo = new CalendarMoon();

        vo.id = StringUtility.escapeSQLInput(dto.id) || undefined;
        vo.name = StringUtility.escapeSQLInput(dto.name || null);
        vo.cycle = this.checkNumber(dto.cycle || 0);
        vo.description = StringUtility.escapeSQLInput(dto.description || null);
        vo.shift = this.checkNumber(dto.shift || 0);

        // Convert phases.
        vo.phases = [];
        if (dto.phases != null && dto.phases.length > 0) {
            dto.phases.forEach((value) => {
                let item = this.convertMoonPhaseDtoToVo(value);
                if (item != null) {
                    vo.phases.push(item);
                }
            })
        }

        return vo;
    }

    protected convertMoonPhaseVoToDto(vo: CalendarMoonPhase): CalendarMoonPhaseDTO {
        if (!vo) {
            return null;
        }

        let dto: CalendarMoonPhaseDTO = {dtoType: DTOType.CALENDAR_MOON_PHASE};

        dto.id = vo.id;
        dto.name = vo.name;
        dto.createdDate = vo.createdDate;
        dto.updatedDate = vo.updatedDate;
        dto.order = vo.order;
        dto.viewingAngleEnd = vo.viewingAngleEnd;
        dto.viewingAngleStart = vo.viewingAngleEnd;

        return dto;
    }

    protected convertMoonPhaseDtoToVo(dto: CalendarMoonPhaseDTO): CalendarMoonPhase {
        if (!dto) {
            return null;
        }

        let vo = new CalendarMoonPhase();

        vo.id = StringUtility.escapeSQLInput(dto.id) || undefined;
        vo.name = StringUtility.escapeSQLInput(dto.name || null);
        vo.order = this.checkNumber(dto.order || 0);
        vo.viewingAngleEnd = this.checkNumber(dto.viewingAngleEnd || 0);
        vo.viewingAngleStart = this.checkNumber(dto.viewingAngleEnd || 0);

        return vo;
    }
}