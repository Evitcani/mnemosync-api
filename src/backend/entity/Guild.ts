import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {TableName} from "../../shared/documentation/databases/TableName";
import {StringUtility} from "mnemoshared/dist/src/utilities/StringUtility";
import {ColumnName} from "../../shared/documentation/databases/ColumnName";

@Entity({name: TableName.USER_TO_GUILD})
export class Guild {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @CreateDateColumn()
    createdDate: Date;

    @UpdateDateColumn()
    updatedDate: Date;

    @Column("text", {name: ColumnName.DISCORD_ID})
    discordId: string;

    @Column("text", {name: ColumnName.GUILD_ID})
    guildId: string;

    @BeforeInsert()
    @BeforeUpdate()
    purifyInsertUpdate() {
        this.discordId = StringUtility.escapeSQLInput(this.discordId);
        this.guildId = StringUtility.escapeSQLInput(this.guildId);
    }
}