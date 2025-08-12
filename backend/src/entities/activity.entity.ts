import { Column, DeleteDateColumn, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { RecordDBO } from "./record.entity";


@Entity({ name: "Activities" })
export class ActivityDBO {

    @PrimaryColumn({ type: "uuid" })
    id!: string;
    @Column({ type: "text" })
    owner_id!: string;
    @Column({ type: "text" })
    representation!: string;
    @Column({ type: "text" })
    unit!: string;
    @Column({ type: "text" })
    description!: string;
    @Column({ type: "numeric" })
    base_amount!: number;
    @OneToMany(() => RecordDBO, (record: RecordDBO) => record.activity)
    records: RecordDBO[];
    @DeleteDateColumn()
    deleted_date: Date;
}