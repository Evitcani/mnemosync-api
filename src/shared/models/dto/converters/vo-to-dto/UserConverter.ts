import {User} from "../../../../../backend/entity/User";
import {UserDTO} from "@evitcani/mnemoshared/dist/src/dto/model/UserDTO";
import {AbstractConverter} from "./AbstractConverter";
import {DTOType} from "@evitcani/mnemoshared/dist/src/dto/DTOType";

export class UserConverter extends AbstractConverter<User, UserDTO> {
    public convertExistingVoToDto(vo: User, dto: UserDTO): UserDTO {
        if (!vo) {
            return null;
        }

        // Convert simple items.
        dto.id = vo.id;
        dto.discord_name = vo.discord_name;
        dto.discord_id = vo.discord_id;
        dto.createdDate = vo.createdDate;
        dto.updatedDate = vo.updatedDate;

        // Convert complex.
        dto.defaultWorldId = vo.defaultWorldId;

        // Convert character.
        dto.defaultCharacterId = vo.defaultCharacterId;

        // Convert party.
        dto.defaultPartyId = vo.defaultPartyId;

        return dto;
    }

    convertExistingDtoToVo(vo: User, dto: UserDTO): User {
        if (!dto) {
            return null;
        }

        vo.id = dto.id || null;
        vo.discord_name = dto.discord_name || null;
        vo.discord_id = dto.discord_id || null;

        vo.defaultWorldId = dto.defaultWorldId || null;
        vo.defaultCharacterId = dto.defaultCharacterId || null;
        vo.defaultPartyId = dto.defaultPartyId || null;

        return vo;
    }

    protected getNewDTO(): UserDTO {
        return {dtoType: DTOType.USER};
    }

    protected getNewVO(): User {
        return new User();
    }
}