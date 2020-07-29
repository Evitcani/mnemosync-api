import {MessageEmbedReturn} from "../models/MessageEmbedReturn";

export class BasicEmbed {
    /**
     * Gets the basic embed with some fields.
     */
    public static get() : MessageEmbedReturn {
        return new MessageEmbedReturn()
            .setColor('#0099ff')
            .setFooter('Created by @Evit_cani on Twitter.');
    }

    public static getPageFooter(page: number, limit: number, total: number): string {
        return `On page ${page}. ${total < limit ? `No more pages.` :
            `Add \`~next ${page + 1}\` to see the next page`}`
    }
}