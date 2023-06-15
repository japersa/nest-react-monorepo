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
  name: 'TBL_REFRESH_TOKEN',
})
export class RefreshToken extends BaseEntity {
  @PrimaryGeneratedColumn()
  idRefreshToken: number;
  @Column({ name: 'idUser', nullable: true })
  idUser: number;
  @Column({ type: 'boolean', nullable: false })
  isRevoked: boolean;
  @Column({ type: 'date', nullable: false })
  expires: Date;
  @ManyToOne(() => User)
  @JoinColumn({ name: 'idUser' })
  User: User;
}
