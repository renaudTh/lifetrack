import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from "typeorm";
import { ActivityDBO } from "./activity.entity";

@Entity({name: "Records"})
export class RecordDBO {
    
    @PrimaryColumn({type: "uuid"})
    id!: string;
    @Column({type: "text"})
    userId!: string;
    @Column({type: "date"})
    date!: string;
    @Column({type: "int"})
    count!: number
    @ManyToOne(() => ActivityDBO, (activity) => activity.records, { onDelete: "NO ACTION" })
    activity: ActivityDBO;
}