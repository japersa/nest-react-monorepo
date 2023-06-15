import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PermissionRole } from './permission_role.entity';
import { User } from './user.entity';

@Entity({
  name: 'TBL_MTR_ROLE',
})
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn()
  idRole: number;
  @Column({ type: 'varchar', nullable: false })
  name: string;
  @Column({ type: 'varchar', nullable: true })
  description: string;
  @OneToMany(() => User, (user) => user.role)
  users: User[];
  @OneToMany(() => PermissionRole, (permissionRole) => permissionRole.role)
  permissionsRoles: PermissionRole[];
}
