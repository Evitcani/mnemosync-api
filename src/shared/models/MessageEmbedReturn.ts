import {MessageEmbedFieldReturn} from "./MessageEmbedFieldReturn";

export class MessageEmbedReturn {
    private title: string;
    private description: string;
    private color: string;
    private thumbnail_url: string;
    private footer: string;
    private timestamp: string;
    private fields: MessageEmbedFieldReturn[] = [];

    public setTitle(title: string): MessageEmbedReturn {
        this.title = title;
        return this;
    }

    public setDescription(description: string): MessageEmbedReturn {
        this.description = description;
        return this;
    }

    public setColor(color: string): MessageEmbedReturn {
        this.color = color;
        return this;
    }

    public setFooter(footer: string): MessageEmbedReturn {
        this.footer = footer;
        return this;
    }

    public setThumbnail(thumbnailUrl: string): MessageEmbedReturn {
        this.thumbnail_url = thumbnailUrl;
        return this;
    }

    public addField(title: string, description: string, inline: boolean): MessageEmbedReturn {
        this.fields.push(new MessageEmbedFieldReturn(title, description, inline));
        return this;
    }
}