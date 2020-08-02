import {Character} from "../../../../../backend/entity/Character";
import {CharacterDTO} from "../../model/CharacterDTO";
import {NicknameConverter} from "./NicknameConverter";
import {PartyConverter} from "./PartyConverter";
import {DTOType} from "../../DTOType";

export class CharacterConverter {
    public static convertVoToDto(vo: Character): CharacterDTO {
        return this.convertExistingVoToDto(vo, {dtoType: DTOType.CHARACTER});
    }

    public static convertExistingVoToDto(vo: Character, dto: CharacterDTO): CharacterDTO {
        if (!vo) {
            return null;
        }

        // Convert simple items.
        dto.id = vo.id;
        dto.name = vo.name;
        dto.createdDate = vo.createdDate;
        dto.updatedDate = vo.updatedDate;
        dto.img_url = vo.img_url;

        // Convert nicknames.
        dto.nicknames = [];
        if (vo.nicknames != null && vo.nicknames.length > 0) {
            vo.nicknames.forEach((value) => {
                let nickname = NicknameConverter.convertVoToDto(value);
                if (nickname != null) {
                    dto.nicknames.push(nickname);
                }
            });
        }

        // Convert party.
        dto.party = {dtoType: DTOType.PARTY};
        dto.party.id = vo.partyId;
        PartyConverter.convertExistingVoToDto(vo.party, dto.party);

        // Return
        return dto;
    }
}