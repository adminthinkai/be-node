import { Injectable } from "@nestjs/common";
import { NotificationExceptions } from "./enum/exceptions.enum";
import { ValidationService } from "src/modules/validation/validation.service";
import { Notification } from "src/models/entities";
import { GetManyNotificationsDto } from "./dtos/get-many-notifications.dto";

@Injectable()
export class NotificationsService {
  constructor(
    private readonly validationService: ValidationService,
  ) {}

  async createNotifications(data, usersId: string[]) {
    usersId.map(async (userId: string) => {
      await Notification.create({userId, ...data})
    })
  }

  async getNotificationsList(params: GetManyNotificationsDto, userId: string) {
    return await Notification.findAndCountAll({
      where: { userId },
      distinct: true,
      order: [
        [params.sortField || 'creationDate', params.sortDirection || 'DESC'],
      ],
      offset: params.page * params.size - params.size,
      limit: params.size,
    });
  }

  async getNotificationsCount(userId: string) {
    return await Notification.count({where: {userId, isViewed: false}});
  }

  async deleteNotificationById(id: string) {
    const notification: any = await this.validationService.getModelWithThrow({
      modelCtor: Notification,
      message: NotificationExceptions.NOT_FOUND,
      criteria: { id },
    });

    await notification.destroy();

    return { id };
  }

  async clearNotifications(userId: string) {
    return await Notification.destroy({ where: { userId } });
  }

  async updateNotificationsStatus(userId: string) {
    return await Notification.update({isViewed: true}, {where: {userId}});;
  }
 
}
