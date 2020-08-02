import {User} from "../../../../../backend/entity/User";
import {UserDTO} from "@evitcani/mnemoshared/dist/src/dto/model/UserDTO";
import {DTOType} from "@evitcani/mnemoshared/dist/src/dto/DTOType";

export class UserConverter {
    public static convertVoToDto(vo: User): UserDTO {
        return this.convertExistingVoToDto(vo, {dtoType: DTOType.USER});
    }

    public static convertExistingVoToDto(vo: User, dto: UserDTO): UserDTO {
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
}