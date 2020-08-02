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
import {World} from "./World";
import {StringUtility} from "@evitcani/mnemoshared/dist/src/utilities/StringUtility";

@Entity({name: TableName.CHARACTER})
export class Character {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    createdDate: Date;

    @UpdateDateColumn()
    updatedDate: Date;

    @Column("text",{ nullable: true, name: "image_url" })
    imgUrl?: string;

    @Column("text")
    name: string;

    @Column({name: "is_npc", nullable: true})
    isNPC?: boolean;

    @Column({nullable: true})
    partyId?: number;

    @ManyToOne(type => Party, party => party.members, {
        eager: true,
        nullable: true,
        onDelete: "SET NULL"
    })
    @JoinColumn()
    party?: Party;

    @OneToMany(type => Nickname, nickname => nickname.character, {
        onDelete: "SET NULL"
    })
    nicknames: Nickname[];

    @Column({nullable: true, name: "world_id"})
    worldId?: string;

    @ManyToOne(type => World, {
        nullable: true,
        onDelete: "SET NULL"
    })
    @JoinColumn({name: "world_id"})
    world?: World;

    @BeforeInsert()
    @BeforeUpdate()
    purifyInsertUpdate() {
        this.name = StringUtility.escapeSQLInput(this.name);
        this.imgUrl = StringUtility.escapeSQLInput(this.imgUrl);
    }
}