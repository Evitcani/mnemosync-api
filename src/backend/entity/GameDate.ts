import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity({name: "game_dates"})
export class GameDate {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({nullable: true})
    day: number;

    @Column({nullable: true})
    month: number;

    @Column({nullable: true})
    year: number;

    @Column({nullable: true})
    significant: boolean;

    @Column({nullable: true})
    name: string;

    @Column({nullable: true})
    description: string;

    @Column({nullable: true})
    recurrence: string;

    @Column({nullable: true, name: "era_id"})
    eraId?: string;

    @Column({nullable: true, name: "calendar_id"})
    calendarId?: string;

    @Column({nullable: true, name: "party_id"})
    partyId?: number;
}