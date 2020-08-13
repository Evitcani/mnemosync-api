import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    CreateDateColumn,
    Entity, JoinColumn, ManyToOne,
    OneToMany, OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {PartyFund} from "./PartyFund";
import {World} from "./World";
import {CurrentDate} from "./CurrentDate";
import {TableName} from "../../shared/documentation/databases/TableName";
import {StringUtility} from "mnemoshared/dist/src/utilities/StringUtility";

@Entity({name: TableName.PARTY})
export class Party {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @CreateDateColumn()
    createdDate: Date;

    @UpdateDateColumn()
    updatedDate: Date;

    @Column("text")
    name: string;

    @Column("text", {name: "guild_id"})
    guildId: string;

    @Column("text", {name: "creator_discord_id"})
    creatorDiscordId: string;

    @OneToMany(type => PartyFund, fund => fund.party, {
        onDelete: "SET NULL",
        eager: true
    })
    funds: PartyFund[];

    @Column({name: "world_id", nullable: true})
    worldId?: string;

    @ManyToOne(type => World, campaign => campaign.parties, {
        nullable: true,
        onDelete: "SET NULL"
    })
    @JoinColumn({name: "world_id"})
    world?: World;

    @Column({name: "current_date_id", nullable: true})
    currentDateId?: string;

    @OneToOne(type => CurrentDate, date => date.party, {
        onDelete: "SET NULL",
        nullable: true
    })
    @JoinColumn({name: "current_date_id"})
    currentDate: CurrentDate;

    @BeforeInsert()
    @BeforeUpdate()
    purifyInsertUpdate() {
        this.name = StringUtility.escapeSQLInput(this.name);
        this.guildId = StringUtility.escapeSQLInput(this.guildId);
        this.creatorDiscordId = StringUtility.escapeSQLInput(this.creatorDiscordId);
    }
}