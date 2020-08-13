import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Character} from "./Character";
import {TableName} from "../../shared/documentation/databases/TableName";
import {World} from "./World";
import {GameDate} from "./GameDate";
import {User} from "./User";
import {StringUtility} from "mnemoshared/dist/src/utilities/StringUtility";
import {ColumnName} from "../../shared/documentation/databases/ColumnName";

@Entity({name: TableName.SENDING})
export class Sending {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({name: ColumnName.CREATED_DATE})
    createdDate: Date;

    @UpdateDateColumn({name: ColumnName.UPDATED_DATE})
    updatedDate: Date;

    @Column({name: ColumnName.WORLD_ID, nullable: true})
    worldId?: string;

    @ManyToOne(type => World, {
        nullable: true,
        onDelete: "SET NULL"
    })
    @JoinColumn({name: ColumnName.WORLD_ID})
    world?: World;

    @ManyToOne(type => GameDate, {
        onDelete: "SET NULL",
        cascade: ["insert", "update"],
        eager: true,
        nullable: true
    })
    @JoinColumn({name: ColumnName.DATE_ID})
    date: GameDate;

    @Column("text")
    content: string;

    @Column("text", {nullable: true})
    reply?: string;

    @Column({nullable: true, name: "no_reply"})
    noReply?: boolean;

    @Column({nullable: true, name: "no_connection"})
    noConnection?: boolean;

    @Column({nullable: true, name: ColumnName.IS_REPLIED})
    isReplied?: boolean;

    @Column({name: ColumnName.TO_CHARACTER_ID, nullable: true})
    toCharacterId?: string;

    @ManyToOne(type => Character, {
        nullable: true,
        onDelete: "SET NULL",
        eager: true
    })
    @JoinColumn({name: ColumnName.TO_CHARACTER_ID})
    toCharacter?: Character;

    @Column({name: ColumnName.FROM_CHARACTER_ID, nullable: true})
    fromCharacterId?: string;

    @ManyToOne(type => Character, {
        nullable: true,
        onDelete: "SET NULL",
        eager: true
    })
    @JoinColumn({name: ColumnName.FROM_CHARACTER_ID})
    fromCharacter?: Character;

    @Column({name: ColumnName.SENDING_MESSAGE_FROM_USER_ID, nullable: true})
    sendingMessageFromUserId?: string;

    @ManyToOne(type => User, {
        nullable: true,
        onDelete: "SET NULL",
        eager: true
    })
    @JoinColumn({name: ColumnName.SENDING_MESSAGE_FROM_USER_ID})
    sendingMessageFromUser: User;

    @Column({name: ColumnName.SENDING_REPLY_FROM_USER_ID, nullable: true})
    sendingReplyFromUserId?: string;

    @ManyToOne(type => User, {
        nullable: true,
        onDelete: "SET NULL",
        eager: true
    })
    @JoinColumn({name: ColumnName.SENDING_REPLY_FROM_USER_ID})
    sendingReplyFromUser: User;

    @BeforeInsert()
    @BeforeUpdate()
    purifyInsertUpdate() {
        this.reply = StringUtility.escapeSQLInput(this.reply);
        this.content = StringUtility.escapeSQLInput(this.content);

        // Checks if the message is replied to or not.
        this.isReplied = this.reply != null || this.noConnection || this.noReply;
    }
}