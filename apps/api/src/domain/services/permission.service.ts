import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudService } from './crud.service';
import { Repository } from 'typeorm';
import { Permission } from '../entities/permission.entity';

@Injectable()
export class PermissionService extends CrudService<Permission> {
  constructor(
    @InjectRepository(Permission)
    private readonly repository: Repository<Permission>,
  ) {
    super(repository);
  }
}
