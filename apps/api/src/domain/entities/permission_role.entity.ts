import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Permission } from './permission.entity';
import { Role } from './role.entity';

@Entity({
  name: 'TBL_MTR_PERMISSION_ROLE',
})
export class PermissionRole extends BaseEntity {
  @PrimaryGeneratedColumn()
  idPermissionRole: number;

  @Column({ name: 'idPermission' })
  idPermission: number;

  @Column({ name: 'idRole' })
  idRole: number;

  @ManyToOne(() => Role, (user) => user.permissionsRoles)
  @JoinColumn({ name: 'idRole' })
  role: Role;

  @ManyToOne(() => Permission, (permission) => permission.permissionsRoles)
  @JoinColumn({ name: 'idPermission' })
  permission: Permission;
}
