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
import { SessionService } from '../../domain/services/session.service';
import { SessionDto } from '../../domain/dto/session.dto';
import { PaginateOptions } from 'src/domain/services/crud.service';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginateResponseDto } from 'src/domain/dto/paginated-response.dto';

@ApiTags('sessions')
@Controller('sessions')
export class SessionController {
  constructor(private readonly _service: SessionService) {}

  /**
   *
   * @returns {PaginateResponseDto{}} Returns all sessions with theirs pagination
   * @param res
   * @param options
   */
  @ApiOperation({ summary: 'Read all sessions' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Sessions has been successfully finded.',
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
    const { page, offset } = options;
    const sessions = await this._service.paginate({
      page,
      offset,
      order: { idSession: 'DESC' },
      relations: ['user'],
    });
    return res.status(HttpStatus.OK).json(sessions);
  }

  /**
   *
   * @returns {SessionDto{}} Returns a session by id
   * @param res
   * @param param
   */
  @ApiOperation({ summary: 'Search a session' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The id has been successfully finded.',
    type: SessionDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Session doesn't exist!",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  public async findOne(@Response() res, @Param() param) {
    const session = await this._service.findOne({
      where: { idSession: param.id },
    });

    if (session) {
      return res.status(HttpStatus.OK).json(session);
    }

    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: "Session doesn't exist!" });
  }

  /**
   *
   * @returns {SessionDto{}} Returns a new session
   * @param res
   * @param sessionDto
   */
  @ApiOperation({ summary: 'Create session' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record has been successfully created.',
    type: SessionDto,
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
    description: 'Session already exists.',
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  public async create(@Response() res, @Body() sessionDto: SessionDto) {
    const session = await this._service.create(sessionDto);
    return res.status(HttpStatus.OK).json(session);
  }

  /**
   *
   * @returns {SessionDto{}} Returns a updated session
   * @param param
   * @param res
   * @param body
   */
  @ApiOperation({ summary: 'Update session' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record has been successfully updated.',
    type: SessionDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Session doesn't exist!",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @ApiResponse({
    status: HttpStatus.FOUND,
    description: 'Session already exists.',
  })
  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  public async update(@Param() param, @Response() res, @Body() body) {
    const options = { where: { idSession: param.id } };
    const session = await this._service.update(body, options);

    if (session) {
      return res.status(HttpStatus.OK).json(session);
    }

    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: "Session doesn't exist!" });
  }
}
