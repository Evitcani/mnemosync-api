import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Party} from "./Party";
import {TableName} from "../../shared/documentation/databases/TableName";
import {StringUtility} from "@evitcani/mnemoshared/dist/src/utilities/StringUtility";

@Entity({name: TableName.PARTY_FUND})
export class PartyFund {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @CreateDateColumn()
    createdDate: Date;

    @UpdateDateColumn()
    updatedDate: Date;

    @Column({name: "partyId"})
    partyId: number;

    @ManyToOne(type => Party, party => party.funds, {
        cascade: true
    })
    party: Party;

    @Column("text")
    type: string;

    @Column({ nullable: true })
    amount?: number;

    @BeforeInsert()
    @BeforeUpdate()
    purifyInsertUpdate() {
        this.type = StringUtility.escapeSQLInput(this.type);
    }

    isNegative: boolean = false;
}