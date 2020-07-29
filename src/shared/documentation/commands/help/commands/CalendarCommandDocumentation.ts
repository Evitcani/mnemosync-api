import {BaseCommandDocumentation} from "./BaseCommandDocumentation";
import {Commands} from "../../Commands";
import {CommandStrut} from "../../CommandStrut";
import {Subcommands} from "../../Subcommands";
import {MessageEmbedReturn} from "../../../../models/MessageEmbedReturn";
import {BasicEmbed} from "../../../BasicEmbed";

export class CalendarCommandDocumentation extends BaseCommandDocumentation {
    getBasicDescription(): string {
        return "";
    }

    getCommand(): string {
        return Commands.CALENDAR;
    }

    getFullDescription(): MessageEmbedReturn {
        return BasicEmbed.get()
            .setTitle(` Command`);
    }

    getSubcommands(): Map<CommandStrut, string> {
        let map = new Map<CommandStrut, string>();
        map.set(Subcommands.CREATE, ``);
        return map;
    }
}