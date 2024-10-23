import { Controller, Get, Req, UseGuards, Post, Body } from '@nestjs/common';
import { AccessTokenGuard } from 'src/guards/access-token-guard.service';
import { IReqWithUser } from 'src/interfaces/IReqWithUser';
import { ClonesService } from './clones.service';
import { AdminGuard } from 'src/guards/admin-guard.service';
import { UserService } from '../user/services/user.service';

@Controller('clone')
export class ClonesController {
  constructor(private readonly cloneService: ClonesService) {}

  @UseGuards(AdminGuard)
  @Post('/create')
  createClone(@Body() dto: any) {
    return this.cloneService.create(dto);
  }

  @Get('')
  getClone() {
    return this.cloneService.getClone();
  }
}
