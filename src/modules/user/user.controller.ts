import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Query,
  Patch,
  Delete,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './services/user.service';
import { CreateSuperAdminDto } from './dtos/create-superadmin.dto';
import { GetManyUsersDto } from './dtos/get-many-users.dto';
import { GetOneUserDto } from './dtos/get-one-user.dto';
import { UpdateUserDto } from './dtos/update-user-info.dto';
import { DeleteUserDto } from './dtos/delete-user.dto';
import { AccessTokenGuard } from 'src/guards/access-token-guard.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AzureService } from 'src/integration/azure/azure.service';
import { IReqWithUser } from 'src/interfaces/IReqWithUser';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly azureService: AzureService,
  ) {}

  @Post('/super-admin')
  createSuperAdmin(@Body() dto: CreateSuperAdminDto, @Req() req: Request) {
    return this.userService.createSuperAdmin(dto, req);
  }

  @UseGuards(AccessTokenGuard)
  @Get('/get-me')
  getMePartial(@Req() { user }: IReqWithUser) {
    return this.userService.getMe(user.id);
  }

  @UseGuards(AccessTokenGuard)
  @Get('/get-users-list')
  getUsersList(@Query() dto: GetManyUsersDto) {
    return this.userService.getUsersList(dto);
  }

  @UseGuards(AccessTokenGuard)
  @Get('/get-user-by-id')
  getUserById(@Query() dto: GetOneUserDto) {
    return this.userService.getUserByIdAndThrowIfNotExist(dto.id);
  }

  @UseGuards(AccessTokenGuard)
  @Patch('/update-user')
  updateUser(@Body() dto: UpdateUserDto) {
    return this.userService.updateUserById(dto);
  }

  @UseGuards(AccessTokenGuard)
  @Delete('/delete-user')
  deleteUser(@Req() { user }: IReqWithUser) {
    return this.userService.deleteUserById(user.id, user.role);
  }
}
