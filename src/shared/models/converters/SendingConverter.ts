import {AbstractConverter} from "./AbstractConverter";
import {Sending} from "../../../backend/entity/Sending";
import {SendingDTO} from "mnemoshared/dist/src/dto/model/SendingDTO";
import {DTOType} from "mnemoshared/dist/src/dto/DTOType";
import {DateConverter} from "./DateConverter";
import {StringUtility} from "mnemoshared/dist/src/utilities/StringUtility";
import {UserConverter} from "./UserConverter";
import {inject, injectable} from "inversify";
import {CharacterConverter} from "./CharacterConverter";
import {TYPES} from "../../../types";

@injectable()
export class SendingConverter extends AbstractConverter<Sending, SendingDTO> {
    private dateConverter: DateConverter;
    private userConverter: UserConverter;
    private characterConverter: CharacterConverter;

    constructor(@inject(TYPES.CharacterConverter) characterConverter: CharacterConverter,
                @inject(TYPES.DateConverter) dateConverter: DateConverter,
                @inject(TYPES.UserConverter) userConverter: UserConverter) {
        super();
        this.characterConverter = characterConverter;
        this.dateConverter = dateConverter;
        this.userConverter = userConverter;
    }

    convertExistingDtoToVo(vo: Sending, dto: SendingDTO): Sending {
        if (!dto) {
            return null;
        }

        vo.id = StringUtility.escapeSQLInput(dto.id) || undefined;
        vo.worldId = StringUtility.escapeSQLInput(dto.worldId || null);

        // Users
        vo.sendingMessageFromUser = this.userConverter.convertDtoToVo(dto.sendingMessageFromUser || null);
        vo.sendingReplyFromUser = this.userConverter.convertDtoToVo(dto.sendingReplyFromUser || null);

        // Messages
        vo.reply = StringUtility.escapeSQLInput(dto.reply || null);
        vo.content = StringUtility.escapeSQLInput(dto.content || null);

        // This part...
        vo.noReply = dto.noReply || false;
        vo.noConnection = dto.noConnection || false;
        vo.isReplied = vo.noReply || vo.noConnection || vo.reply != null;

        // Character
        vo.fromCharacterId = StringUtility.escapeSQLInput(dto.fromCharacterId ||
            (dto.fromCharacter != null ? dto.fromCharacter.id : null) || null);
        vo.toCharacterId = StringUtility.escapeSQLInput(dto.toCharacterId ||
            (dto.toCharacter != null ? dto.toCharacter.id : null) || null);
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
        dto.sendingMessageFromUser = this.userConverter.convertVoToDto(vo.sendingMessageFromUser || null);
        dto.sendingReplyFromUser = this.userConverter.convertVoToDto(vo.sendingReplyFromUser || null);

        // Messages
        dto.reply = vo.reply || null;
        dto.content = vo.content || null;

        // This part...
        dto.noReply = vo.noReply || false;
        dto.noConnection = vo.noConnection || false;
        dto.isReplied = vo.noReply || vo.noConnection || vo.reply != null;

        // Character
        dto.fromCharacter = this.characterConverter.convertVoToDto(vo.fromCharacter || null);
        dto.toCharacter = this.characterConverter.convertVoToDto(vo.toCharacter || null);
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