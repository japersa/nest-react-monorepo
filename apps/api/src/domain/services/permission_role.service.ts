import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudService } from './crud.service';
import { Repository } from 'typeorm';
import { PermissionRole } from '../entities/permission_role.entity';

@Injectable()
export class PermissionRoleService extends CrudService<PermissionRole> {
  constructor(
    @InjectRepository(PermissionRole)
    private readonly repository: Repository<PermissionRole>,
  ) {
    super(repository);
  }

  async deleteByRole(idRole) {
    return await this.deleteAll({ where: { idRole: idRole } });
  }
}
