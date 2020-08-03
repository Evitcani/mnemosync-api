export interface CharacterQuery {
    name?: string;
    discord_id?: string;
    world_id?: string;
    is_npc?: boolean | null;
}

export const ALL_CHARACTER_QUERY: string[] = ["name", "discord_id", "world_id", "is_npc"];