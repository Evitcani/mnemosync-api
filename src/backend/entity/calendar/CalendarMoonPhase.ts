import {
    BeforeInsert, BeforeUpdate,
    Column,
    CreateDateColumn, Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {CalendarMoon} from "./CalendarMoon";
import {TableName} from "../../../shared/documentation/databases/TableName";
import {StringUtility} from "mnemoshared/dist/src/utilities/StringUtility";

@Entity({name: TableName.MOON_PHASE})
export class CalendarMoonPhase {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({name: "created_date"})
    createdDate: Date;

    @UpdateDateColumn({name: "updated_date"})
    updatedDate: Date;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    order: number;

    @Column("decimal", {name: "viewing_angle_start", precision: 7, scale: 4})
    viewingAngleStart: number;

    @Column("decimal", {name: "viewing_angle_end", precision: 7, scale: 4})
    viewingAngleEnd: number;

    @Column({name: "calendar_moon_id"})
    moonId: string;

    @ManyToOne(type => CalendarMoon, moon => moon.phases,{
        cascade: true
    })
    @JoinColumn({name: "calendar_moon_id"})
    moon: CalendarMoon;

    @BeforeInsert()
    @BeforeUpdate()
    purifyInsertUpdate() {
        this.name = StringUtility.escapeSQLInput(this.name);
    }
}