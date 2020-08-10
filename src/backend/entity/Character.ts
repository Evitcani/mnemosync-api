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

    @Column("text", {name: ColumnName.NAME})
    name: string;

    @Column({nullable: true, name: ColumnName.IS_NPC})
    isNPC?: boolean;

    @Column({nullable: true, name: ColumnName.PARTY_ID})
    partyId?: number;

    @ManyToOne(type => Party, party => party.members, {
        eager: true,
        nullable: true,
        onDelete: "SET NULL"
    })
    @JoinColumn({name: ColumnName.PARTY_ID})
    party?: Party;

    @OneToMany(type => Nickname, nickname => nickname.character, {
        onDelete: "SET NULL"
    })
    nicknames: Nickname[];

    @BeforeInsert()
    @BeforeUpdate()
    purifyInsertUpdate() {
        this.name = StringUtility.escapeSQLInput(this.name);
        this.imgUrl = StringUtility.escapeSQLInput(this.imgUrl);
    }
}