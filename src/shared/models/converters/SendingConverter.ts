import {AbstractConverter} from "./AbstractConverter";
import {Sending} from "../../../backend/entity/Sending";
import {SendingDTO} from "@evitcani/mnemoshared/dist/src/dto/model/SendingDTO";
import {DTOType} from "@evitcani/mnemoshared/dist/src/dto/DTOType";
import {User} from "../../../backend/entity/User";
import {DateConverter} from "./DateConverter";
import {StringUtility} from "@evitcani/mnemoshared/dist/src/utilities/StringUtility";

export class SendingConverter extends AbstractConverter<Sending, SendingDTO> {
    private dateConverter: DateConverter;

    constructor() {
        super();
        this.dateConverter = new DateConverter();
    }

    convertExistingDtoToVo(vo: Sending, dto: SendingDTO): Sending {
        if (!dto) {
            return null;
        }

        vo.id = StringUtility.escapeSQLInput(dto.id) || undefined;
        vo.worldId = StringUtility.escapeSQLInput(dto.worldId || null);

        // First user.
        vo.sendingMessageFromUser = new User();
        vo.sendingMessageFromUser.discord_name = StringUtility.escapeSQLInput(dto.sendingReplyFromDiscordName) || undefined;
        vo.sendingMessageFromUser.discord_id = StringUtility.escapeSQLInput(dto.sendingMessageFromDiscordId || null);

        // Second user.
        vo.sendingReplyFromUser = new User();
        vo.sendingReplyFromUser.discord_name = StringUtility.escapeSQLInput(dto.sendingReplyFromDiscordName) || undefined;
        vo.sendingReplyFromUser.discord_id = StringUtility.escapeSQLInput(dto.sendingReplyFromDiscordId || null);

        // Messages
        vo.reply = StringUtility.escapeSQLInput(dto.reply || null);
        vo.content = StringUtility.escapeSQLInput(dto.content || null);

        // This part...
        vo.noReply = dto.noReply || false;
        vo.noConnection = dto.noConnection || false;
        vo.isReplied = vo.noReply || vo.noConnection || vo.reply != null;

        // Character
        vo.fromCharacterId = StringUtility.escapeSQLInput(dto.fromCharacterId || null);
        vo.toCharacterId = StringUtility.escapeSQLInput(dto.toCharacterId || null);
        vo.date = this.dateConverter.convertDtoToVo(dto.inGameDate);

        return vo;
    }

    convertExistingVoToDto(vo: Sending, dto: SendingDTO): SendingDTO {
        if (!vo) {
            return null;
        }

        dto.id = vo.id || undefined;
        dto.worldId = vo.worldId || null;

        // First user.
        dto.sendingReplyFromDiscordName = vo.sendingMessageFromUser.discord_name || null;
        dto.sendingMessageFromDiscordId = vo.sendingMessageFromUser.discord_id || null;

        // Second user.
        dto.sendingReplyFromDiscordName = vo.sendingReplyFromUser.discord_name || null;
        dto.sendingReplyFromDiscordId = vo.sendingReplyFromUser.discord_id || null;

        // Messages
        dto.reply = vo.reply || null;
        dto.content = vo.content || null;

        // This part...
        dto.noReply = vo.noReply || false;
        dto.noConnection = vo.noConnection || false;
        dto.isReplied = vo.noReply || vo.noConnection || vo.reply != null;

        // Character
        dto.fromCharacterId = vo.fromCharacterId || null;
        dto.toCharacterId = vo.toCharacterId || null;
        dto.inGameDate = this.dateConverter.convertVoToDto(vo.date);

        return dto;
    }

    protected getNewDTO(): SendingDTO {
        return {dtoType: DTOType.SENDING};
    }

    protected getNewVO(): Sending {
        return new Sending();
    }

}