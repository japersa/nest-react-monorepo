import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PermissionRole } from './permission_role.entity';

@Entity({
  name: 'TBL_MTR_PERMISSION',
})
export class Permission extends BaseEntity {
  @PrimaryGeneratedColumn()
  idPermission: number;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  description: string;

  @OneToMany(
    () => PermissionRole,
    (permissionRole) => permissionRole.permission,
  )
  permissionsRoles: PermissionRole[];
}
