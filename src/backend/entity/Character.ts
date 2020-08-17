import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Party} from "./Party";
import {Nickname} from "./Nickname";
import {TableName} from "../../shared/documentation/databases/TableName";
import {StringUtility} from "mnemoshared/dist/src/utilities/StringUtility";
import {ColumnName} from "../../shared/documentation/databases/ColumnName";
import {WorldToCharacter} from "./WorldToCharacter";

@Entity({name: TableName.CHARACTER})
export class Character {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({name: ColumnName.CREATED_DATE})
    createdDate: Date;

    @UpdateDateColumn({name: ColumnName.UPDATED_DATE})
    updatedDate: Date;

    @Column("text",{ nullable: true, name: ColumnName.IMG_URL })
    imgUrl?: string;

    @Column({nullable: true, name: ColumnName.WORLD_TO_CHARACTER_ID})
    worldToCharacterId?: string;

    @ManyToOne(type => WorldToCharacter, {
        nullable: true,
        cascade: ["update", "insert"],
        onDelete: "SET NULL"
    })
    @JoinColumn({name: ColumnName.WORLD_TO_CHARACTER_ID})
    worldToCharacter?: WorldToCharacter;

    @OneToMany(type => Nickname, nickname => nickname.character, {
        onDelete: "SET NULL",
        cascade: ["update", "insert"]
    })
    nicknames: Nickname[];

    @BeforeInsert()
    @BeforeUpdate()
    purifyInsertUpdate() {
        this.imgUrl = StringUtility.escapeSQLInput(this.imgUrl);
    }
}