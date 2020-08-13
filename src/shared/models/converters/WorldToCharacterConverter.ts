import {injectable} from "inversify";
import {AbstractConverter} from "./AbstractConverter";
import {WorldToCharacter} from "../../../backend/entity/WorldToCharacter";
import {WorldToCharacterDTO} from "mnemoshared/dist/src/dto/model/WorldToCharacterDTO";
import {DTOType} from "mnemoshared/dist/src/dto/DTOType";
import {PartyConverter} from "./PartyConverter";

@injectable()
export class WorldToCharacterConverter extends AbstractConverter<WorldToCharacter, WorldToCharacterDTO> {
    private partyConverter: PartyConverter;

    constructor() {
        super();

        this.partyConverter = new PartyConverter();
    }

    convertExistingDtoToVo(vo: WorldToCharacter, dto: WorldToCharacterDTO): WorldToCharacter | null {
        if (dto == null) {
            return null;
        }

        vo.id = dto.id;
        vo.isNpc = dto.isNpc || false;
        vo.characterId = dto.characterId;
        vo.partyId = dto.partyId;
        vo.worldId = dto.worldId;

        return vo;
    }

    convertExistingVoToDto(vo: WorldToCharacter, dto: WorldToCharacterDTO): WorldToCharacterDTO | null {
        if (vo == null) {
            return null;
        }

        dto.id = vo.id;
        dto.createdDate = vo.createdDate;
        dto.updatedDate = vo.updatedDate;
        dto.isNpc = vo.isNpc;
        dto.worldId = vo.worldId;
        dto.characterId = vo.characterId;
        dto.partyId = vo.partyId;
        dto.party = this.partyConverter.convertVoToDto(vo.party);

        return dto;
    }

    protected getNewDTO(): WorldToCharacterDTO {
        return {dtoType: DTOType.WORLD_TO_CHARACTER};
    }

    protected getNewVO(): WorldToCharacter {
        return new WorldToCharacter();
    }

}