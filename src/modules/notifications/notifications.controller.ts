import {
  Controller,
  UseGuards,
  Get,
  Patch,
  Query,
  Req,
  Delete,
} from "@nestjs/common";
import { NotificationsService } from "./notifications.service";
import { AccessTokenGuard } from "src/guards/access-token-guard.service";
import { IReqWithUser } from "src/interfaces/IReqWithUser";
import { GetManyNotificationsDto } from "./dtos/get-many-notifications.dto";
import { DeleteNotificationDto } from "./dtos/delete-notification.dto";

@Controller("notifications")
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}


  @UseGuards(AccessTokenGuard)
  @Get('/get-notifications')
  getNotificationsList(
    @Query() dto: GetManyNotificationsDto,
    @Req() { user }: IReqWithUser
    ) {
    return this.notificationsService.getNotificationsList(dto, user.id);
  }

  @UseGuards(AccessTokenGuard)
  @Get('/get-notifications-count')
  getNotificationsCount(@Req() { user }: IReqWithUser) {
    return this.notificationsService.getNotificationsCount(user.id);
  }

  @UseGuards(AccessTokenGuard)
  @Delete('/delete-notification')
  deleteNotification(@Query() { id }: DeleteNotificationDto) {
    return this.notificationsService.deleteNotificationById(id);
  }

  @UseGuards(AccessTokenGuard)
  @Delete('/clear-notifications')
  clearNotifications(@Req() { user }: IReqWithUser) {
    return this.notificationsService.clearNotifications(user.id);
  }

  @UseGuards(AccessTokenGuard)
  @Patch('/update-notifications-status')
  updateNotificationsStatus(@Req() { user }: IReqWithUser) {
    return this.notificationsService.updateNotificationsStatus(user.id);
  }

}
