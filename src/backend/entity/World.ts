import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Party} from "./Party";
import {TableName} from "../../shared/documentation/databases/TableName";
import {ColumnName} from "../../shared/documentation/databases/ColumnName";
import {StringUtility} from "mnemoshared/dist/src/utilities/StringUtility";

@Entity({name: TableName.WORLD})
export class World {
    // Type of this class.
    type = "World";

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column("text",{name: ColumnName.NAME})
    name: string;

    @Column({name: ColumnName.GUILD_ID})
    guildId: string;

    @CreateDateColumn({name: ColumnName.CREATED_DATE})
    createdDate: Date;

    @UpdateDateColumn({name: ColumnName.UPDATED_DATE})
    updatedDate: Date;

    @Column("text",{name: ColumnName.MAP_URL, nullable: true})
    mapUrl: string;

    @OneToMany(type => Party, party => party.world, {
        onDelete: "SET NULL",
        nullable: true
    })
    parties?: Party[];

    @BeforeInsert()
    @BeforeUpdate()
    purifyInsertUpdate() {
        this.guildId = StringUtility.escapeSQLInput(this.guildId);
        this.mapUrl = StringUtility.escapeSQLInput(this.mapUrl);
        this.name = StringUtility.escapeSQLInput(this.name);
    }
}