import {AbstractConverter} from "./AbstractConverter";
import {Sending} from "../../../../../backend/entity/Sending";
import {SendingDTO} from "@evitcani/mnemoshared/dist/src/dto/model/SendingDTO";
import {DTOType} from "@evitcani/mnemoshared/dist/src/dto/DTOType";
import {User} from "../../../../../backend/entity/User";
import {DateConverter} from "./DateConverter";

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

        vo.id = dto.id || null;
        vo.worldId = dto.worldId || null;

        // First user.
        vo.sendingMessageFromUser = new User();
        vo.sendingMessageFromUser.discord_name = dto.sendingReplyFromDiscordName || null;
        vo.sendingMessageFromUser.discord_id = dto.sendingMessageFromDiscordId || null;

        // Second user.
        vo.sendingReplyFromUser = new User();
        vo.sendingReplyFromUser.discord_name = dto.sendingReplyFromDiscordName || null;
        vo.sendingReplyFromUser.discord_id = dto.sendingReplyFromDiscordId || null;

        // Messages
        vo.reply = dto.reply || null;
        vo.content = dto.content || null;

        // This part...
        vo.noReply = dto.noReply || false;
        vo.noConnection = dto.noConnection || false;
        vo.isReplied = vo.noReply || vo.noConnection || vo.reply != null;

        // Character
        vo.fromCharacterId = dto.fromCharacterId || null;
        vo.toCharacterId = dto.toCharacterId || null;
        vo.date = this.dateConverter.convertDtoToVo(dto.inGameDate);

        return vo;
    }

    convertExistingVoToDto(vo: Sending, dto: SendingDTO): SendingDTO {
        if (!vo) {
            return null;
        }

        dto.id = vo.id || null;
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