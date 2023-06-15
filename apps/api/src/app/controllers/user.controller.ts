import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { UserDto } from '../../domain/dto/user.dto';
import { UserService } from '../../domain/services/user.service';
import { PaginateOptions } from 'src/domain/services/crud.service';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginateResponseDto } from 'src/domain/dto/paginated-response.dto';
import { User } from 'src/domain/entities/user.entity';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly _service: UserService) {}

  /**
   *
   * @returns {PaginateResponseDto{}} Returns all users with theirs pagination
   * @param res
   * @param options
   * @param req
   */
  @ApiOperation({ summary: 'Read all users' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Users has been successfully finded.',
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
  @UseGuards(JwtAuthGuard)
  @Get()
  public async findAll(
    @Response() res,
    @Query() options: PaginateOptions,
    @Request() req,
  ) {
    const users = await this._service.getUsers(req, options);
    return res.status(HttpStatus.OK).json(users);
  }

  /**
   *
   * @returns {User{}} Returns an user by id
   * @param res
   * @param param
   */
  @ApiOperation({ summary: 'Search an user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The id has been successfully finded.',
    type: User,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "User doesn't exist!",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  public async findOne(@Response() res, @Param() param) {
    const user = await this._service.findOne({
      relations: ['role'],
      where: { idUser: param.id },
    });

    if (user) {
      return res.status(HttpStatus.OK).json(user);
    }
    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: 'User does not exist' });
  }

  /**
   *
   * @returns {User{}} Returns a new user
   * @param res
   * @param createUserDto
   */
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record has been successfully created.',
    type: User,
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
    description: 'User already exists.',
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  public async create(@Response() res, @Body() createUserDto: UserDto) {
    const user = await this._service.createUser(createUserDto);
    return res.status(HttpStatus.OK).json(user);
  }

  /**
   *
   * @returns {User{}} Returns a updated user
   * @param param
   * @param res
   * @param body
   */
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record has been successfully updated.',
    type: User,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "User doesn't exist!",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @ApiResponse({
    status: HttpStatus.FOUND,
    description: 'User already exists.',
  })
  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  public async update(@Param() param, @Response() res, @Body() body) {
    const user = await this._service.updateUser(param, body);
    if (user) {
      return res.status(HttpStatus.OK).json(user);
    }
    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: 'User does not exist' });
  }
}
