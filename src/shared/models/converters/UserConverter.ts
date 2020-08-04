import {User} from "../../../backend/entity/User";
import {UserDTO} from "@evitcani/mnemoshared/dist/src/dto/model/UserDTO";
import {AbstractConverter} from "./AbstractConverter";
import {DTOType} from "@evitcani/mnemoshared/dist/src/dto/DTOType";
import {StringUtility} from "@evitcani/mnemoshared/dist/src/utilities/StringUtility";

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

        vo.id = this.checkNumber(dto.id || null);
        vo.discord_name = StringUtility.escapeSQLInput(dto.discord_name || null);
        vo.discord_id = StringUtility.escapeSQLInput(dto.discord_id || null);

        vo.defaultWorldId = StringUtility.escapeSQLInput(dto.defaultWorldId || null);
        vo.defaultCharacterId = StringUtility.escapeSQLInput(dto.defaultCharacterId || null);
        vo.defaultPartyId = this.checkNumber(dto.defaultPartyId || null);

        return vo;
    }

    protected getNewDTO(): UserDTO {
        return {dtoType: DTOType.USER};
    }

    protected getNewVO(): User {
        return new User();
    }
}