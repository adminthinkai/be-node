import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSuperAdminDto } from '../dtos/create-superadmin.dto';
import { UserExceptions } from '../enum/exceptions.enum';
import { UserCredentialsService } from './user-credentials.service';
import { User } from '../../../models/user.model';
import { CreateUserDto } from '../dtos/create-user.dto';
import { filterForUsers } from '../filters';
import { GetManyUsersDto } from '../dtos/get-many-users.dto';
import { UpdateUserDto } from '../dtos/update-user-info.dto';
import { UserRole } from 'src/models/enum/UserRole';
import { UserStatus } from 'src/models/enum/UserStatus';
import { ValidationService } from 'src/modules/validation/validation.service';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class UserService {
  constructor(
    private readonly userCredentialsService: UserCredentialsService,
    private readonly validationService: ValidationService,
  ) {}
  async createSuperAdmin({ email, password }: CreateSuperAdminDto, req: any) {
    //const dbConnection: Sequelize = req.dbConnection;
    // const candidate = await dbConnection
    //   .model('User')
    //   .findOne({ where: { email } });
    const candidate = await User.findOne({ where: { email } });

    if (candidate) {
      throw new HttpException(UserExceptions.EMAIL_ALREADY_EXISTS, 410);
    }

    const created = await User.create({
      email,
      role: UserRole.SUPERADMIN,
      status: UserStatus.ACTIVE,
    });

    await this.userCredentialsService.savePassword({
      userId: created.id,
      password,
    });

    return created;
  }

  async getMe(userId: string) {
    return User.findByPk(userId);
  }

  async createUser({ email, role, ...pureDto }: CreateUserDto) {
    const candidate = await User.findOne({ where: { email } });

    if (candidate) {
      throw new HttpException(UserExceptions.EMAIL_ALREADY_EXISTS, 410);
    }

    const created = await User.create({
      ...pureDto,
      role,
      email,
    });

    return this.getById(created.id);
  }

  async getById(id: string) {
    return User.findOne({
      where: { id },
    });
  }

  async getByEmail(email: string) {
    return this.validationService.getModelWithThrow({
      modelCtor: User,
      criteria: { email },
      message: UserExceptions.NOT_FOUND,
      attributes: ['id', 'email', 'status'],
    });
  }

  async saveRefreshToken(userId: string, refreshToken: string) {
    return this.userCredentialsService.saveRefreshToken({
      userId,
      refreshToken,
    });
  }

  async getUsersList(params: GetManyUsersDto) {
    const whereCriteria = await filterForUsers({ ...params });

    return await User.findAndCountAll({
      where: whereCriteria,
      distinct: true,
      order: [
        [params.sortField || 'creationDate', params.sortDirection || 'DESC'],
      ],
      offset: params.page * params.size - params.size,
      limit: params.size,
    });
  }

  async getUserByIdAndThrowIfNotExist(id: string) {
    const user = await User.findOne({
      where: { id },
    });

    if (!user) {
      throw new HttpException(UserExceptions.NOT_FOUND, HttpStatus.BAD_REQUEST);
    }

    return user;
  }

  async updateUserById({ userId, ...pureDto }: UpdateUserDto) {
    const user: any = await this.validationService.getModelWithThrow({
      modelCtor: User,
      message: UserExceptions.NOT_FOUND,
      criteria: { id: userId },
    });

    return await user.update(pureDto);
  }

  async deleteUserById(requsterId: string, requsterRole: string) {
    // if (userToDeleteId !== requsterId) {
    //   // if (requsterRole !== UserRole.ADMIN && requsterRole !== UserRole.SUPERADMIN){
    //   //   throw new HttpException(UserExceptions.ACCESS_DENIED_BY_REQUESTER_ROLE, HttpStatus.FORBIDDEN)
    //   // }
    //   throw new HttpException(
    //     UserExceptions.ACCESS_DENIED_BY_REQUESTER_ROLE,
    //     HttpStatus.FORBIDDEN,
    //   );
    // }

    const user: any = await this.validationService.getModelWithThrow({
      modelCtor: User,
      message: UserExceptions.NOT_FOUND,
      criteria: { id: requsterId },
    });

    await user.destroy();

    return { requsterId };
  }

  async getAllUsersId() {
    const users = await User.findAll({});

    return users.map((user) => user.id);
  }
}
