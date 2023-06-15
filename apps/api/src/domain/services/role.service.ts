import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudService } from './crud.service';
import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';

@Injectable()
export class RoleService extends CrudService<Role> {
  constructor(
    @InjectRepository(Role)
    private readonly repository: Repository<Role>,
  ) {
    super(repository);
  }
}
