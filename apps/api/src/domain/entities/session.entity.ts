import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({
  name: 'TBL_SESSION',
})
export class Session extends BaseEntity {
  @PrimaryGeneratedColumn()
  idSession: number;
  @Column({ name: 'idUser', nullable: false })
  idUser: number;
  @Column({ type: 'varchar', nullable: false })
  token: string;
  @Column({ type: 'varchar', nullable: false })
  refreshToken: string;
  @Column({
    type: 'timestamptz',
    nullable: true,
    default: () => 'now()',
  })
  createdAt: Date;
  @Column({
    type: 'timestamptz',
    nullable: true,
    default: () => 'now()',
  })
  updatedAt: Date;
  @ManyToOne(() => User)
  @JoinColumn({ name: 'idUser' })
  user: User;
}
