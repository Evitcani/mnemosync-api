import {
    BeforeInsert, BeforeUpdate,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Calendar} from "./Calendar";
import {TableName} from "../../../shared/documentation/databases/TableName";
import {StringUtility} from "@evitcani/mnemoshared/dist/src/utilities/StringUtility";

@Entity({name: TableName.MONTH})
export class CalendarMonth {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({name: "created_date"})
    createdDate: Date;

    @UpdateDateColumn({name: "updated_date"})
    updatedDate: Date;

    @Column({name: "name"})
    name: string;

    @Column({nullable: true})
    description: string;

    @Column({name: "length"})
    length: number;

    @Column({name: "order"})
    order: number;

    @Column({name: "calendar_id"})
    calendarId: string;

    @ManyToOne(type => Calendar, calendar => calendar.months,{
        cascade: true
    })
    @JoinColumn({name: "calendar_id"})
    calendar: Calendar;

    @BeforeInsert()
    @BeforeUpdate()
    purifyInsertUpdate() {
        this.name = StringUtility.escapeSQLInput(this.name);
        this.description = StringUtility.escapeSQLInput(this.description);
    }
}