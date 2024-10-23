import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ClassExceptions } from './enum/exceptions.enum';
import { ValidationService } from 'src/modules/validation/validation.service';
import {
  AppBranding,
  Class,
  ClassHistory,
  Notification,
} from 'src/models/entities';
import { CreateClassDto } from './dtos/create-class.dto';
import { UpdateClassDto } from './dtos/update-class.dto';
import { GetManyClassesDto } from './dtos/get-many-classes.dto';
import { filterForClasses } from './filters';
import { Op } from 'sequelize';
import { ChatService } from '../messages/chat.service';
import { GenerateContentDto } from './dtos/generate-content.dto copy';
import { GetClassHistoryDto } from './dtos/get-class-history.dto copy';
import { UserService } from '../user/services/user.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ClassService {
  constructor(
    private readonly validationService: ValidationService,
    private readonly chatService: ChatService,
    private readonly userService: UserService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async createClass({ ...pureDto }: CreateClassDto, creatorId: string) {
    const created = await Class.create({ ...pureDto, creatorId });

    if (pureDto.public === true) {
      let usersId = await this.userService.getAllUsersId();
      usersId = usersId.filter((n) => {
        return n != creatorId;
      });

      this.notificationsService.createNotifications(
        { classId: created.id, text: `Public Class '${created.name}' created` },
        usersId,
      );
    }

    return this.getClassByIdAndThrowIfNotExist(created.id);
  }

  async generateContent({ ...pureDto }: GenerateContentDto, userId: string) {
    // const appOptions = await AppBranding.findOne()

    // if (appOptions.usingInternalData === true) {
    await this.chatService.createChat();
    // }

    const class_ = await this.getClassByIdAndThrowIfNotExist(pureDto.classId);

    const message =
      class_.prompt +
      ' ' +
      class_.input1 +
      ' : ' +
      pureDto.valueInput1 +
      ', ' +
      class_?.input2 +
      ' : ' +
      pureDto?.valueInput2 +
      ', ' +
      class_?.input3 +
      ' : ' +
      pureDto?.valueInput3 +
      ', ' +
      class_?.input4 +
      ' : ' +
      pureDto?.valueInput4 +
      '.';

    const answer = await this.chatService.getMessagesData(message);

    const data = { ...pureDto, content: answer.content };

    await ClassHistory.create({
      classId: pureDto.classId,
      content: answer.content,
      creatorId: userId,
    });

    return this.updateClassById(data);
  }

  async getClassesList(params: GetManyClassesDto, creatorId: string) {
    const whereCriteria = await filterForClasses({ ...params });

    return await Class.findAndCountAll({
      where: {
        [Op.or]: [
          { [Op.and]: whereCriteria, creatorId },
          { [Op.and]: whereCriteria, public: true },
        ],
      },
      distinct: true,
      attributes: {
        exclude: [
          'content',
          'input1',
          'input2',
          'input3',
          'input4',
          'placeholderInput1',
          'placeholderInput2',
          'placeholderInput3',
          'placeholderInput4',
          'valueInput1',
          'valueInput2',
          'valueInput3',
          'valueInput4',
        ],
      },
      order: [
        [params.sortField || 'creationDate', params.sortDirection || 'DESC'],
      ],
      offset: params.page * params.size - params.size,
      limit: params.size,
    });
  }

  async getClassHistory(params: GetClassHistoryDto) {
    return await ClassHistory.findAndCountAll({
      where: { classId: params.classId },
      distinct: true,
      order: [['creationDate', params.sortDirection || 'DESC']],
      offset: params.page * params.size - params.size + 1,
      limit: params.size,
    });
  }

  async getClassByIdAndThrowIfNotExist(id: string) {
    const class_ = await Class.findOne({
      where: { id },
    });

    if (!class_) {
      throw new HttpException(
        ClassExceptions.NOT_FOUND,
        HttpStatus.BAD_REQUEST,
      );
    }

    return class_;
  }

  async updateClassById({ classId, ...pureDto }: UpdateClassDto) {
    const class_: any = await this.validationService.getModelWithThrow({
      modelCtor: Class,
      message: ClassExceptions.NOT_FOUND,
      criteria: { id: classId },
    });

    return await class_.update(pureDto);
  }

  async deleteClassById(id: string) {
    const class_: any = await this.validationService.getModelWithThrow({
      modelCtor: Class,
      message: ClassExceptions.NOT_FOUND,
      criteria: { id },
    });

    await class_.destroy();

    return { id };
  }
}
