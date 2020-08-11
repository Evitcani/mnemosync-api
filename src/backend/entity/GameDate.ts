import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {ColumnName} from "../../shared/documentation/databases/ColumnName";
import {TableName} from "../../shared/documentation/databases/TableName";

@Entity({name: TableName.GAME_DATE})
export class GameDate {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({nullable: true})
    day: number;

    @Column({nullable: true})
    month: number;

    @Column({nullable: true})
    year: number;

    @Column({nullable: false})
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

    @Column({nullable: true, name: ColumnName.PARTY_ID})
    partyId?: number;
}