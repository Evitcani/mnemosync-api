import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {TableName} from "../../shared/documentation/databases/TableName";
import {ColumnName} from "../../shared/documentation/databases/ColumnName";
import {Character} from "./Character";
import {World} from "./World";
import {Party} from "./Party";

@Entity({name: TableName.WORLD_TO_CHARACTER})
export class WorldToCharacter {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({name: ColumnName.CREATED_DATE})
    createdDate: Date;

    @UpdateDateColumn({name: ColumnName.UPDATED_DATE})
    updatedDate: Date;

    @Column({nullable: true, name: ColumnName.IS_NPC})
    isNpc?: boolean;

    @Column({nullable: true, name: ColumnName.WORLD_ID})
    worldId: string;

    @ManyToOne(type => World, {
        onDelete: "CASCADE"
    })
    @JoinColumn({name: ColumnName.WORLD_ID})
    world: World;

    @Column({nullable: true, name: ColumnName.PARTY_ID})
    partyId: number;

    @ManyToOne(type => Party, {
        onDelete: "CASCADE"
    })
    @JoinColumn({name: ColumnName.PARTY_ID})
    party: Party;

    @Column("text", {nullable: true, name: ColumnName.CHARACTER_ID})
    characterId: string;

    @ManyToOne(type => Character, {
        onDelete: "CASCADE"
    })
    @JoinColumn({name: ColumnName.CHARACTER_ID})
    character: Character;
}