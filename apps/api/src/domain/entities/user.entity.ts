import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from './role.entity';

@Entity({
  name: 'TBL_MTR_USER',
})
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  idUser: number;
  @Column({ type: 'varchar', nullable: false })
  firstName: string;
  @Column({ type: 'varchar', nullable: true })
  secondName: string;
  @Column({ type: 'varchar', nullable: false })
  lastName: string;
  @Column({ type: 'varchar', nullable: true })
  secondLastName: string;
  @Column({ type: 'varchar', nullable: false })
  documentNumber: string;
  @Column({ type: 'varchar', nullable: true })
  email: string;
  @Column({ type: 'varchar', nullable: true })
  phone: string;
  @Column({ type: 'varchar', nullable: false })
  password: string;
  @Column({ name: 'idRole' })
  idRole: number;
  @Column({ type: 'varchar', nullable: true })
  userName: string;
  @Column({ type: 'varchar', nullable: true })
  remember_token: string;
  @ManyToOne(() => Role)
  @JoinColumn({ name: 'idRole' })
  role: Role;
}
