import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Response,
  UseGuards,
} from '@nestjs/common';
import { RoleService } from '../../domain/services/role.service';
import { RoleDto } from '../../domain/dto/role.dto';
import { PaginateOptions } from 'src/domain/services/crud.service';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginateResponseDto } from 'src/domain/dto/paginated-response.dto';
import { Role } from 'src/domain/entities/role.entity';
import { PermissionRoleService } from 'src/domain/services/permission_role.service';
import { ILike } from 'typeorm';

@ApiTags('roles')
@Controller('roles')
export class RoleController {
  constructor(
    private readonly _service: RoleService,
    private readonly _servicePermissionRole: PermissionRoleService,
  ) {}

  /**
   *
   * @returns {PaginateResponseDto{}} Returns all roles with theirs pagination
   * @param res
   * @param options
   */
  @ApiOperation({ summary: 'Read all roles' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Roles has been successfully finded.',
    type: PaginateResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @UseGuards(JwtAuthGuard)
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'offset',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'search',
    type: String,
    required: false,
  })
  @Get()
  public async findAll(@Response() res, @Query() options: PaginateOptions) {
    const { page, offset, search } = options;

    const roles = await this._service.paginate({
      page,
      offset,
      order: { idRole: 'DESC' },
      where: [
        ...(search !== null && search !== undefined && search != ''
          ? [
              {
                description: ILike(`%${search}%`),
              },
              {
                name: ILike(`%${search}%`),
              },
            ]
          : []),
      ],
    });
    return res.status(HttpStatus.OK).json(roles);
  }

  /**
   *
   * @returns {Role{}} Returns a role by id
   * @param res
   * @param param
   */
  @ApiOperation({ summary: 'Search a role' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The id has been successfully finded.',
    type: Role,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Role doesn't exist!",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  public async findOne(@Response() res, @Param() param) {
    const role = await this._service.findOne({
      where: { idRole: param.id },
      relations: ['company'],
    });

    let objRole = {
      idRole: 0,
      name: '',
      description: '',
      permissions: [],
    };
    if (role) {
      const permissionsRoles = await this._servicePermissionRole.findAll({
        where: { idRole: role.idRole },
      });
      const permissions = permissionsRoles.map((permssionrole) =>
        String(permssionrole.idPermission),
      );
      objRole = {
        ...objRole,
        idRole: role.idRole,
        name: role.name,
        description: role.description,
      };
      objRole = { ...objRole, permissions: permissions };
      return res.status(HttpStatus.OK).json(objRole);
    }

    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: "Role doesn't exist!" });
  }

  /**
   *
   * @returns {Role{}} Returns a new role
   * @param res
   * @param roleDto
   */
  @ApiOperation({ summary: 'Create role' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record has been successfully created.',
    type: Role,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @ApiResponse({
    status: HttpStatus.FOUND,
    description: 'Role already exists.',
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  public async create(@Response() res, @Body() roleDto: RoleDto) {
    const roleExists = await this._service.findOne({
      where: { name: roleDto.name },
    });
    if (roleExists) {
      return res
        .status(HttpStatus.FOUND)
        .json({ message: 'Role already exists!' });
    }
    const role = await this._service.create(roleDto);
    const roleCreated = await this._service.findOne({
      where: { idRole: role.idRole },
    });
    if (roleDto.permissions.length > 0) {
      for (let index = 0; index < roleDto.permissions.length; index++) {
        const element = roleDto.permissions[index];
        const permissionRoleExists = await this._servicePermissionRole.findAll({
          where: {
            idRole: roleCreated.idRole,
            idPermission: Number(element.idPermission),
          },
        });
        if (permissionRoleExists.length == 0) {
          const objDto = {
            idRole: roleCreated.idRole,
            idPermission: Number(element.idPermission),
          };
          await this._servicePermissionRole.create(objDto);
        }
      }
      return res.status(HttpStatus.OK).json(role);
    } else {
      return res.status(HttpStatus.OK).json(role);
    }
  }

  /**
   *
   * @returns {Role{}} Returns a updated role
   * @param param
   * @param res
   * @param body
   */
  @ApiOperation({ summary: 'Update role' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record has been successfully updated.',
    type: Role,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Role doesn't exist!",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @ApiResponse({
    status: HttpStatus.FOUND,
    description: 'Role already exists.',
  })
  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  public async update(@Param() param, @Response() res, @Body() body) {
    const roleExists = await this._service.findOne({
      where: { name: body.name },
    });
    if (roleExists && param.id != roleExists.idRole) {
      return res
        .status(HttpStatus.FOUND)
        .json({ message: 'Role already exists!' });
    }

    const options = { where: { idRole: param.id } };
    const roleUpdated = await this._service.update(body, options);

    if (roleUpdated) {
      if (body.multiselectRef && body.multiselectRef.length > 0) {
        await this._servicePermissionRole.deleteByRole(roleUpdated.idRole);
        for (let index = 0; index < body.multiselectRef.length; index++) {
          const element = body.multiselectRef[index];
          const permissionRoleExists =
            await this._servicePermissionRole.findAll({
              where: {
                idRole: roleUpdated.idRole,
                idPermission: Number(element.idPermission),
              },
            });
          if (permissionRoleExists.length == 0) {
            const objDto = {
              idRole: roleUpdated.idRole,
              idPermission: Number(element.idPermission),
            };
            await this._servicePermissionRole.create(objDto);
          }
        }
        return res.status(HttpStatus.OK).json(roleUpdated);
      } else {
        return res.status(HttpStatus.OK).json(roleUpdated);
      }
    }

    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: "Role doesn't exist!" });
  }
}
