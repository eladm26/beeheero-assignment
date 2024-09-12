import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Forcast } from "./Forcast";

@Entity()
export class Location {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    name: string;

    @Column('float')
    lat: number;

    @Column('float')
    lon: number;

    @OneToMany(() => Forcast, (forcast) => forcast.location)
    forcasts: Forcast[]
}
