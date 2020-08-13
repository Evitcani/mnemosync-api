import {Character} from "./Character";
import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
    UpdateDateColumn
} from "typeorm";
import {World} from "./World";
import {TableName} from "../../shared/documentation/databases/TableName";
import {Party} from "./Party";
import {StringUtility} from "mnemoshared/dist/src/utilities/StringUtility";
import {ColumnName} from "../../shared/documentation/databases/ColumnName";

@Entity({name: TableName.USER})
export class User {
    @PrimaryColumn("text", {name: ColumnName.DISCORD_ID})
    discord_id: string;

    @CreateDateColumn({name: ColumnName.UPDATED_DATE})
    createdDate: Date;

    @UpdateDateColumn({name: ColumnName.CREATED_DATE})
    updatedDate: Date;

    @Column("text", {name: ColumnName.DISCORD_NAME})
    discord_name: string;

    @Column({name: ColumnName.DEFAULT_CHARACTER_ID, nullable: true})
    defaultCharacterId?: string;

    @ManyToOne(type => Character, {
        nullable: true,
        onDelete: "SET NULL"
    })
    @JoinColumn({name: ColumnName.DEFAULT_CHARACTER_ID})
    defaultCharacter?: Character;

    @Column({name: "default_world_id", nullable: true})
    defaultWorldId?: string;

    @ManyToOne(type => World, {
        nullable: true,
        onDelete: "SET NULL"
    })
    @JoinColumn({name: "default_world_id"})
    defaultWorld?: World;

    @Column({name: "default_party_id", nullable: true})
    defaultPartyId?: number;

    @ManyToOne(type => Party, {
        nullable: true,
        onDelete: "SET NULL"
    })
    @JoinColumn({name: "default_party_id"})
    defaultParty?: Party;

    @BeforeInsert()
    @BeforeUpdate()
    purifyInsertUpdate() {
        this.discord_name = StringUtility.escapeSQLInput(this.discord_name);
        this.discord_id = StringUtility.escapeSQLInput(this.discord_id);
    }
}