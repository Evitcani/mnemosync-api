export class MessageEmbedFieldReturn {
    private title: string;
    private description: string;
    private inline: boolean = false;

    constructor(title: string, description: string, inline: boolean) {
        this.title = title;
        this.description = description;
        this.inline = inline;
    }

    public toJSON(): { inline: boolean; description: null; title: null } {
        let json = {
            title: null,
            description: null,
            inline: false
        };
        json.title = this.title;
        json.description = this.description;
        json.inline = this.inline;

        return json;
    }
}