import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    CreateDateColumn,
    Entity, JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Character} from "./Character";
import {StringUtility} from "mnemoshared/dist/src/utilities/StringUtility";
import {ColumnName} from "../../shared/documentation/databases/ColumnName";
import {TableName} from "../../shared/documentation/databases/TableName";

@Entity({name: TableName.NICKNAME})
export class Nickname {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({name: ColumnName.CREATED_DATE})
    createdDate: Date;

    @UpdateDateColumn({name: ColumnName.UPDATED_DATE})
    updatedDate: Date;

    @Column("text")
    name: string;

    @Column({name: ColumnName.IS_PRIMARY_NAME})
    isPrimaryName: boolean;

    @Column({name: ColumnName.CHARACTER_ID})
    characterId: string;

    @ManyToOne(type => Character, {
        cascade: true,
        eager: true
    })
    @JoinColumn({name: ColumnName.CHARACTER_ID})
    character: Character;

    discordId: string;

    @BeforeInsert()
    @BeforeUpdate()
    purifyInsertUpdate() {
        this.name = StringUtility.escapeSQLInput(this.name);
    }
}