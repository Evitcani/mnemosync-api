import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn} from "typeorm";
import {TableName} from "../../shared/documentation/databases/TableName";
import {ColumnName} from "../../shared/documentation/databases/ColumnName";
import {Character} from "./Character";

@Entity({name: TableName.USER_TO_CHARACTER})
export class UserToCharacter {
    @PrimaryColumn("text", {nullable: true, name: ColumnName.DISCORD_ID})
    discordId: string;

    @CreateDateColumn({name: ColumnName.CREATED_DATE})
    createdDate: Date;

    @UpdateDateColumn({name: ColumnName.UPDATED_DATE})
    updatedDate: Date;

    @PrimaryColumn({nullable: true, name: ColumnName.CHARACTER_ID})
    characterId: string;

    @ManyToOne(type => Character, {
        onDelete: "CASCADE"
    })
    @JoinColumn({name: ColumnName.CHARACTER_ID})
    character: Character;
}