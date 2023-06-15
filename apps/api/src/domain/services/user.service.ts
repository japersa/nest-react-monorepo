import * as bcrypt from 'bcryptjs';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CrudService, PaginateOptions } from './crud.service';
import { User } from '../entities/user.entity';
import { UserDto } from '../dto/user.dto';
import { MailService } from './mail.service';
import { PermissionRoleService } from './permission_role.service';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService extends CrudService<User> {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
    private readonly mailService: MailService,
    private readonly permissionRoleService: PermissionRoleService,
  ) {
    super(repository);
  }

  async getUsers(req, options: PaginateOptions) {
    const exclude = ['password'];
    const { page, offset, search } = options;

    return await this.paginate({
      page,
      offset,
      relations: ['role'],
      where: [
        ...(search !== null && search !== undefined && search != ''
          ? [
              {
                firstName: ILike(`%${options.search}%`),
              },
              {
                secondName: ILike(`%${options.search}%`),
              },
              {
                lastName: ILike(`%${options.search}%`),
              },
              {
                secondLastName: ILike(`%${options.search}%`),
              },
              {
                email: ILike(`%${options.search}%`),
              },
              {
                documentNumber: ILike(`%${options.search}%`),
              },
              {
                phone: ILike(`%${options.search}%`),
              },
            ]
          : []),
      ],
    });
  }

  async updateUser(param, body) {
    const permissionRole = await this.permissionRoleService.findAll({
      where: { idRole: body.idRole },
      relations: ['permission'],
    });
    const checkUniqueDocument = await this.findOne({
      where: { documentNumber: body.documentNumber },
    });
    const checkUniqueEmail = await this.findOne({
      where: { email: body.email },
    });
    const checkUniqueUserName = await this.findOne({
      where: { userName: body.userName },
    });
    if (
      checkUniqueEmail &&
      permissionRole.filter((p) => p.permission.name == 'feature:courier')
        .length == 0 &&
      checkUniqueEmail.idUser != param.id
    ) {
      return new HttpException(
        'This email already exists to other user.',
        HttpStatus.CONFLICT,
      );
    } else if (checkUniqueDocument && checkUniqueDocument.idUser != param.id) {
      return new HttpException(
        'This document already exists to other user.',
        HttpStatus.CONFLICT,
      );
    } else if (checkUniqueUserName && checkUniqueUserName.idUser != param.id) {
      return new HttpException(
        'This user name already exists to other user.',
        HttpStatus.CONFLICT,
      );
    } else {
      const userExists = await this.findOne({
        where: { idUser: param.id },
      });
      if (body.password == '' || body.password == undefined) {
        body.password = userExists.password;
      } else {
        body.password = await bcrypt.hash(body.password, 10);
      }
      const options = { where: { idUser: param.id } };
      return await this.update(body, options);
    }
  }

  async createUser(createUserDto: UserDto) {
    const permissionRole = await this.permissionRoleService.findAll({
      where: { idRole: createUserDto.idRole },
      relations: ['permission'],
    });
    const checkUniqueDocument = await this.findOne({
      where: { documentNumber: createUserDto.documentNumber },
    });
    let checkUniqueEmail;

    if (createUserDto.email) {
      checkUniqueEmail = await this.findOne({
        where: { email: createUserDto.email },
      });
    }
    const checkUniqueUserName = await this.findOne({
      where: { userName: createUserDto.userName },
    });
    if (
      checkUniqueEmail &&
      permissionRole.filter((p) => p.permission.name == 'feature:courier')
        .length == 0
    ) {
      return new HttpException(
        'This email already exists to other user.',
        HttpStatus.CONFLICT,
      );
    } else if (checkUniqueDocument) {
      return new HttpException(
        'This document already exists to other user.',
        HttpStatus.CONFLICT,
      );
    } else if (checkUniqueUserName) {
      return new HttpException(
        'This user name already exists to other user.',
        HttpStatus.CONFLICT,
      );
    } else {
      let user = createUserDto;
      const password = await bcrypt.hash(createUserDto.password, 10);
      user = { ...user, password: password };

      createUserDto.email &&
        createUserDto.email != '' &&
        (await this.mailService.sendMail({
          to: createUserDto.email,
          subject: 'Welcome!',
          template: 'welcome',
          context: {
            firstName: createUserDto.firstName,
            lastName: createUserDto.lastName,
            email: createUserDto.email,
            password: createUserDto.password,
          },
        }));

      return await this.create(user);
    }
  }
}
