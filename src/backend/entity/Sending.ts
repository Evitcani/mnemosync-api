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
import {StringUtility} from "@evitcani/mnemoshared/dist/src/utilities/StringUtility";

@Entity({name: TableName.SENDING})
export class Sending {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({name: "created_date"})
    createdDate: Date;

    @UpdateDateColumn({name: "updated_date"})
    updatedDate: Date;

    @Column({name: "world_id", nullable: true})
    worldId?: string;

    @ManyToOne(type => World, {
        nullable: true,
        onDelete: "SET NULL"
    })
    @JoinColumn({name: "world_id"})
    world?: World;

    @ManyToOne(type => GameDate, {
        onDelete: "SET NULL",
        eager: true,
        nullable: true
    })
    @JoinColumn({name: "date_id"})
    date: GameDate;

    @Column("text")
    content: string;

    @Column("text", {nullable: true})
    reply?: string;

    @Column({nullable: true, name: "no_reply"})
    noReply?: boolean;

    @Column({nullable: true, name: "no_connection"})
    noConnection?: boolean;

    @Column({nullable: true, name: "is_replied"})
    isReplied?: boolean;

    @Column({name: "to_character_id", nullable: true})
    toCharacterId?: string;

    @ManyToOne(type => Character, {
        nullable: true,
        onDelete: "SET NULL",
        eager: true
    })
    @JoinColumn({name: "to_character_id"})
    toCharacter?: Character;

    @Column({name: "from_character_id", nullable: true})
    fromCharacterId?: string;

    @ManyToOne(type => Character, {
        nullable: true,
        onDelete: "SET NULL",
        eager: true
    })
    @JoinColumn({name: "from_character_id"})
    fromCharacter?: Character;

    @ManyToOne(type => User, {
        nullable: true,
        onDelete: "SET NULL",
        eager: true
    })
    @JoinColumn({name: "sending_message_from_user_id"})
    sendingMessageFromUser: User;

    @ManyToOne(type => User, {
        nullable: true,
        onDelete: "SET NULL",
        eager: true
    })
    @JoinColumn({name: "sending_reply_from_user_id"})
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