export interface PartyQuery {
    name?: string;
    guild_id?: string;
    world_id?: string;
    character_id?: string;
}

export const ALL_PARTY_QUERY: string[] = ["name", "guild_id", "world_id", "character_id"];