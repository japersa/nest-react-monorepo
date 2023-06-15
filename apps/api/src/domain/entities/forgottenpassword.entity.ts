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
  name: 'TBL_FORGOTTEN_PASSWORD',
})
export class ForgottenPassword extends BaseEntity {
  @PrimaryGeneratedColumn()
  idForgottenPassword: number;
  @Column({ name: 'idUser' })
  idUser: number;
  @Column({ type: 'varchar', nullable: false })
  email: string;
  @Column({ type: 'varchar', nullable: false })
  newPasswordToken: string;
  @Column({
    type: 'timestamptz',
    nullable: true,
    default: () => 'now()',
  })
  timestamp: Date;
  @ManyToOne(() => User)
  @JoinColumn({ name: 'idUser' })
  User: User;
}
