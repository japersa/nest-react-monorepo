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
import { PermissionRoleService } from '../../domain/services/permission_role.service';
import { PermissionRoleDto } from '../../domain/dto/permission_role.dto';
import { PaginateOptions } from 'src/domain/services/crud.service';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginateResponseDto } from 'src/domain/dto/paginated-response.dto';

@ApiTags('permissionsRoles')
@Controller('permissionsRoles')
export class PermissionRoleController {
  constructor(private readonly _service: PermissionRoleService) {}

  /**
   *
   * @returns {PaginateResponseDto{}} Returns all permissions roles with theirs pagination
   * @param res
   * @param options
   */
  @ApiOperation({ summary: 'Read all Permission Roles' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Permission Roles has been successfully finded.',
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
    const permissionRoles = await this._service.paginate(options);
    return res.status(HttpStatus.OK).json(permissionRoles);
  }

  /**
   *
   * @returns {PermissionRoleDto{}} Returns a permission role by id
   * @param res
   * @param param
   */
  @ApiOperation({ summary: 'Search a permission role' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The id has been successfully finded.',
    type: PermissionRoleDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Permission role doesn't exist!",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  public async findOne(@Response() res, @Param() param) {
    const permissionRole = await this._service.findOne({
      where: { idPermissionRole: param.id },
    });

    if (permissionRole) {
      return res.status(HttpStatus.OK).json(permissionRole);
    }

    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: "Permission role doesn't exist!" });
  }

  /**
   *
   * @returns {PermissionRoleDto{}} Returns a new permissionRole
   * @param res
   * @param permissionRoleDto
   */
  @ApiOperation({ summary: 'Create permission role' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record has been successfully created.',
    type: PermissionRoleDto,
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
    description: 'Permission - role already exists.',
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  public async create(
    @Response() res,
    @Body() permissionRoleDto: PermissionRoleDto,
  ) {
    const permRoleExists = await this._service.findOne({
      where: {
        idPermission: permissionRoleDto.idPermission,
        idRole: permissionRoleDto.idRole,
      },
    });
    if (permRoleExists) {
      return res
        .status(HttpStatus.FOUND)
        .json({ message: 'Permission - role already exists!' });
    }
    const permissionRole = await this._service.create(permissionRoleDto);
    return res.status(HttpStatus.OK).json(permissionRole);
  }

  /**
   *
   * @returns {PermissionRoleDto{}} Returns a updated permission role
   * @param param
   * @param res
   * @param body
   */
  @ApiOperation({ summary: 'Update permission role' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record has been successfully updated.',
    type: PermissionRoleDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Permission role doesn't exist!",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @ApiResponse({
    status: HttpStatus.FOUND,
    description: 'Permission - role already exists.',
  })
  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  public async update(@Param() param, @Response() res, @Body() body) {
    const permRoleExists = await this._service.findOne({
      where: { idPermission: body.idPermission, idRole: body.idRole },
    });
    if (permRoleExists && param.id != permRoleExists.idPermissionRole) {
      return res
        .status(HttpStatus.FOUND)
        .json({ message: 'Permission - role already exists!' });
    }

    const options = { where: { idPermissionRole: param.id } };
    const permissionRole = await this._service.update(body, options);

    if (permissionRole) {
      return res.status(HttpStatus.OK).json(permissionRole);
    }

    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: "Permission role doesn't exist!" });
  }
}
