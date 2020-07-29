import {Subcommands} from "../../shared/documentation/commands/Subcommands";
import {StringUtility} from "./StringUtility";
import {Command} from "../../shared/models/generic/Command";
import {GameDate} from "../entity/GameDate";
import {CalendarController} from "../controllers/world/calendar/CalendarController";
import {CalendarMonth} from "../entity/calendar/CalendarMonth";
import {Calendar} from "../entity/calendar/Calendar";
import {CalendarMoon} from "../entity/calendar/CalendarMoon";

export class MessageUtility {

    public static async processDateCommand(command: Command): Promise<GameDate> {
        const dateCmd = Subcommands.DATE.getCommand(command);
        let input = dateCmd.getInput();
        if (input == null) {
            return Promise.resolve(null);
        }
        // Split the date and process.
        let dates = input.split("/");
        if (dates.length < 3) {
            return Promise.resolve(null);
        }

        // TODO: Implement era processing.
        let day = StringUtility.getNumber(dates[0]),
            month = StringUtility.getNumber(dates[1]),
            year = StringUtility.getNumber(dates[2]);

        // TODO: Better response here.
        if (day == null || month == null || year == null) {
            return Promise.resolve(null);
        }

        // Now put it inside the sending.
        let inGameDate = new GameDate();
        inGameDate.day = day;
        inGameDate.month = month;
        inGameDate.year = year;

        return Promise.resolve(inGameDate)
    }

    public static async getProperDate(date: GameDate, calendar: Calendar,
                                      calendarController: CalendarController): Promise<string> {
        if (calendar == null) {
            calendar = await calendarController.get(date.calendarId);
            if (calendar == null) {
                return Promise.resolve(null);
            }
        }

        let day = date.day;
        let month = date.month;
        let year = date.year;

        return `${day}${this.nthOfNumber(day)} of ${this.getMonthName(month, calendar.months)}, ${year} `;
    }

    public static getMonthName(month: number, months: CalendarMonth[]): string {
        if (months == null) {
            return null;
        }

        // Sort months by order.
        months.sort((a, b) => {
            return a.order - b.order;
        });

        // Get the last month if we exceed.
        if (months.length <= month) {
            return months[months.length - 1].name;
        }

        // Return the name.
        return months[month].name;
    }

    public static nthOfNumber(n: number): string {
        if (n > 10 && n < 20) {
            return "th";
        }

        let str = String(n);
        let sub = str.substr(str.length - 1, 1);

        switch (sub) {
            case "1":
                return "st";
            case "2":
                return "nd";
            case "3":
                return "rd";
            default:
                return "th";
        }
    }

    /**
     * day = number of days as time goes on
     PlanetPeriod = number of days in planet's year
     Moon1Period = number of days in moon1 cycle
     Moon2Period = number of days in moon2 cycle

     Col 1: Angle of planet relative to sun = (day MOD PlanetPeriod) * (360/PlanetPeriod)
     Col 2: Angle of moon1 relative to planet = (day MOD Moon1Period) * (360/Moon1Period)
     Col 3: Angle of moon2 relative to planet = (day MOD Moon2Period) * (360/Moon2Period)
     Col 4: Viewing Angle of Moon1 = Col2 minus Col1
     Col 5: Viewing Angle of Moon2 = Col3 minus Col1

     The Viewing Angle will tell you what phase the moon is in. A Viewing Angle of 0 degrees is a full moon. Viewing angle
     of 90 degrees is a first quarter moon. 180 degrees is a new moon. Etc, through 360.
     */
    public static getMoonPhase(moon: CalendarMoon, day: number, daysInYear: number): string {
        let col1: number = (day % daysInYear) * (360 / daysInYear);
        let col2: number = ((day + moon.shift) % moon.cycle) * (360 / moon.cycle);
        let col3: number = col2 - col1;

        if (moon.phases != null) {
            moon.phases.sort((a, b) => {
                return a.order - b.order;
            });

            moon.phases.forEach((phase) => {
                if (col3 >= phase.viewingAngleStart && col3 < phase.viewingAngleEnd) {
                    return phase.name;
                }
            });
        }

        if (col3 >= 337.5 && col3 < 22.5) {
            return "Full Moon";
        }

        if (col3 >= 22.5 && col3 < 67.5) {
            return "Waxing Gibbous";
        }

        if (col3 >= 67.5 && col3 < 112.5) {
            return "First Quarter";
        }

        if (col3 >= 112.5 && col3 < 157.5) {
            return "Waxing Crescent";
        }

        if (col3 >= 157.5 && col3 < 202.5) {
            return "New Moon";
        }

        if (col3 >= 202.5 && col3 < 247.5) {
            return "Waning Crescent";
        }

        if (col3 >= 247.5 && col3 < 292.5) {
            return "Last Quarter";
        }

        return "Waning Gibbous";
    }
}