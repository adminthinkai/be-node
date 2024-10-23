import { CreationOptional } from "sequelize";
import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import {
  // Chat,
  User,
} from "./entities";
import { ChatRole } from "./enum/ChatRole";

@Table({ tableName: "ChatsMessages", timestamps: true})
export class ChatsMessages extends Model<ChatsMessages> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  id: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true
  })
  message: string;

  @Column({
    type: DataType.ENUM(...Object.values(ChatRole)),
  })
  role: ChatRole;

  @ForeignKey(() =>User)
  @Column({ type: DataType.UUID, allowNull: true })
  userId: string;

  @BelongsTo(() => User)
  user: User;

  // @ForeignKey(() => Chat)
  // @Column({ type: DataType.UUID, allowNull: true })
  // chatId: string;

  // @BelongsTo(() => Chat)
  // chat: Chat;

  @CreatedAt
  declare creationDate: CreationOptional<Date>;

  @UpdatedAt
  declare lastUpdateDate: CreationOptional<Date>;

}