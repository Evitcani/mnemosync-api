import {
    BeforeInsert, BeforeUpdate,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne, OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Calendar} from "./Calendar";
import {TableName} from "../../../shared/documentation/databases/TableName";
import {CalendarMoonPhase} from "./CalendarMoonPhase";
import {StringUtility} from "mnemoshared/dist/src/utilities/StringUtility";

@Entity({name: TableName.MOON})
export class CalendarMoon {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({name: "created_date"})
    createdDate: Date;

    @UpdateDateColumn({name: "updated_date"})
    updatedDate: Date;

    @Column()
    name: string;

    @Column({nullable: true})
    description: string;

    @Column()
    cycle: number;

    @Column()
    shift: number;

    @OneToMany(type => CalendarMoonPhase, phase => phase.moon, {
        onDelete: "SET NULL",
        nullable: true,
        eager: true
    })
    phases?: CalendarMoonPhase[];

    @Column({name: "calendar_id"})
    calendarId: string;

    @ManyToOne(type => Calendar, calendar => calendar.moons,{
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