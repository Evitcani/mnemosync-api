import {BaseCommandDocumentation} from "./BaseCommandDocumentation";
import {Commands} from "../../Commands";
import {CommandStrut} from "../../CommandStrut";
import {Subcommands} from "../../Subcommands";
import {MessageEmbedReturn} from "../../../../models/MessageEmbedReturn";
import {BasicEmbed} from "../../../BasicEmbed";
import {Bot} from "../../../Bot";

export class BankCommandDocumentation extends BaseCommandDocumentation {
    getBasicDescription(): string {
        return `Used to access the funds in the bank for the party.`;
    }

    getCommand(): string {
        return Commands.BANK;
    }

    getFullDescription(): MessageEmbedReturn {
        return BasicEmbed.get()
            .setTitle(`Bank Command`)
            .setDescription(`${this.getBasicDescription()} You must have a character in a party to be able to ` +
                `use this command. If given no arguments, it will print the current amount in the bank.\n\n` +
                `**Adding Money**\n` +
                `If given arguments, it will add or subtract that amount from the current amount. To add more ` +
                `money, type out the amount you wish to add like the following:` +
                `\`\`\`${Bot.PREFIX}${this.getCommand()} 1g 2 silver 3 cp\`\`\`` +
                `This will add \`1 gold, 2 silver and 3 copper\` to the current bank fund.\n\n` +
                `**Removing Money**\n` +
                `If given arguments, it will add or subtract that amount from the current amount. You must add a ` +
                `\`-\` sign to any of the numbers to indicate a removal. To remove money, type out the amount ` +
                `you wish to remove like the following:` +
                `\`\`\`${Bot.PREFIX}${this.getCommand()} 1g -2 silver 3 cp\`\`\`` +
                `This will remove \`1 gold, 2 silver and 3 copper\` from the current bank fund.\n\n` +
                `**Subcommands**\n` +
                `${this.formatSubcommands()}`);
    }

    getSubcommands(): Map<CommandStrut, string> {
        let map = new Map<CommandStrut, string>();
        map.set(Subcommands.CREATE, `Creates a new bank fund for the party. Requires no arguments.`);
        return map;
    }
}