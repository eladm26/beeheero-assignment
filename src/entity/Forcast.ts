import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Location } from './Locations';

@Entity()
@Unique(['ts', 'location'])
@Index('idx_forcast_location_ts', ['location.id', 'ts'])
@Index('idx_forcast_feels_like', ['feels_like'])
export class Forcast {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'timestamp', nullable: true })
    ts: Date;

    @Column()
    humidity: number;

    @Column('float')
    temp: number;

    @Column('float')
    feels_like: number;

    @ManyToOne(() => Location, (loc) => loc.forcasts, {cascade: true})
    @JoinColumn({ name: 'locationId' })
    location: Location;
}
