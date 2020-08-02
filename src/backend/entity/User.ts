import {Character} from "./Character";
import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn, JoinTable, ManyToMany, ManyToOne,
    PrimaryGeneratedColumn, UpdateDateColumn
} from "typeorm";
import {StringUtility} from "../utilities/StringUtility";
import {World} from "./World";
import {TableName} from "../../shared/documentation/databases/TableName";
import {Party} from "./Party";

@Entity({name: TableName.USER})
export class User {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @CreateDateColumn()
    createdDate: Date;

    @UpdateDateColumn()
    updatedDate: Date;

    @Column("text")
    discord_name: string;

    @Column("text")
    discord_id: string;

    @Column("int", {name: "default_character_id", nullable: true})
    defaultCharacterId?: string;

    @ManyToOne(type => Character, {
        eager: true,
        nullable: true,
        onDelete: "SET NULL"
    })
    @JoinColumn({name: "default_character_id"})
    defaultCharacter?: Character;

    @Column({name: "default_world_id", nullable: true})
    defaultWorldId?: string;

    @ManyToOne(type => World, {
        eager: true,
        nullable: true,
        onDelete: "SET NULL"
    })
    @JoinColumn({name: "default_world_id"})
    defaultWorld?: World;

    @Column({name: "default_party_id", nullable: true})
    defaultPartyId?: number;

    @ManyToOne(type => Party, {
        eager: true,
        nullable: true,
        onDelete: "SET NULL"
    })
    @JoinColumn({name: "default_party_id"})
    defaultParty?: Party;

    @ManyToMany(type => World, {nullable: true})
    @JoinTable({name: TableName.WORLD_OWNERS})
    campaignsDMing?: World[];

    @BeforeInsert()
    @BeforeUpdate()
    purifyInsertUpdate() {
        this.discord_name = StringUtility.escapeSQLInput(this.discord_name);
        this.discord_id = StringUtility.escapeSQLInput(this.discord_id);
    }
}