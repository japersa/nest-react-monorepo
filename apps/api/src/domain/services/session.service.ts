import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudService } from './crud.service';
import { Repository } from 'typeorm';
import { Session } from '../entities/session.entity';

@Injectable()
export class SessionService extends CrudService<Session> {
  constructor(
    @InjectRepository(Session)
    private readonly repository: Repository<Session>,
  ) {
    super(repository);
  }
}
