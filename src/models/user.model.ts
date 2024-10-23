import { CreationOptional } from 'sequelize';
import {
  Table,
  Column,
  Model,
  HasOne,
  DataType,
  CreatedAt,
  UpdatedAt,
  AfterCreate,
  HasMany,
} from 'sequelize-typescript';
import {
  // Chat,
  ChatsMessages,
  Class,
  ClassHistory,
  UserCredential,
  Notification,
  Clone,
} from './entities';
import { UserRole } from './enum/UserRole';
import { UserStatus } from './enum/UserStatus';

@Table({ tableName: 'Users', timestamps: true })
export class User extends Model<User> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  id: string;

  @Column({
    validate: { isEmail: true },
    unique: true,
    type: DataType.TEXT,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  firstName: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  lastName: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  country: string;

  @Column({
    type: DataType.DATE,
    defaultValue: new Date(),
  })
  lastActivity: Date;

  @Column({
    type: DataType.DATE,
  })
  signUpDate: Date;

  @Column({
    type: DataType.ENUM(...Object.values(UserRole)),
    defaultValue: UserRole.USER,
  })
  role: UserRole;

  @Column({
    type: DataType.ENUM(...Object.values(UserStatus)),
    defaultValue: UserStatus.PENDING,
  })
  status: UserStatus;

  @HasOne(() => Clone, { foreignKey: 'cloneId' })
  clone: Clone;

  @HasOne(() => UserCredential, { onDelete: 'CASCADE' })
  userCredential: UserCredential;

  // @HasOne(() => Chat, { onDelete: "CASCADE" })
  // chat: Chat;

  @HasMany(() => Class)
  classes: Class[];

  @HasMany(() => ClassHistory)
  classHistory: ClassHistory[];

  @HasMany(() => ChatsMessages)
  messages: ChatsMessages[];

  @HasMany(() => Notification)
  notifications: Notification[];

  @CreatedAt
  declare creationDate: CreationOptional<Date>;

  @UpdatedAt
  declare lastUpdateDate: CreationOptional<Date>;

  @AfterCreate
  static async createUserCredentials(instance: User) {
    await UserCredential.create({ userId: instance.id });
  }

  // @AfterCreate
  // static async createChat(instance: User) {
  //   await Chat.create({ userId: instance.id });
  // }
}
