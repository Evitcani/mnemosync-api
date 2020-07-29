import {BaseCommandDocumentation} from "./BaseCommandDocumentation";
import {Commands} from "../../Commands";
import {CommandStrut} from "../../CommandStrut";
import {Subcommands} from "../../Subcommands";
import {BasicEmbed} from "../../../BasicEmbed";
import {MessageEmbedReturn} from "../../../../models/MessageEmbedReturn";

export class WhichCommandDocumentation extends BaseCommandDocumentation {
    getBasicDescription(): string {
        return "";
    }

    getCommand(): string {
        return Commands.WHICH;
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