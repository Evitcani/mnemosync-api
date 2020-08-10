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
import {GameDate} from "../GameDate";
import {TableName} from "../../../shared/documentation/databases/TableName";
import {StringUtility} from "mnemoshared/dist/src/utilities/StringUtility";

@Entity({name: TableName.ERA})
export class CalendarEra {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({name: "created_date"})
    createdDate: Date;

    @UpdateDateColumn({name: "updated_date"})
    updatedDate: Date;

    @Column({name: "name"})
    name: string;

    @Column()
    order: number;

    @ManyToOne(type => GameDate, {
        onDelete: "SET NULL",
        eager: true,
        nullable: true
    })
    @JoinColumn({name: "start_date_id"})
    start: GameDate;

    @ManyToOne(type => GameDate, {
        onDelete: "SET NULL",
        eager: true,
        nullable: true
    })
    @JoinColumn({name: "end_date_id"})
    end?: GameDate;

    @Column({name: "calendar_id"})
    calendarId: string;

    @ManyToOne(type => Calendar, calendar => calendar.eras,{
        cascade: true
    })
    @JoinColumn({name: "calendar_id"})
    calendar: Calendar;

    @BeforeInsert()
    @BeforeUpdate()
    purifyInsertUpdate() {
        this.name = StringUtility.escapeSQLInput(this.name);
    }
}