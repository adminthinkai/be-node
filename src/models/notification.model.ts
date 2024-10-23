import { CreationOptional } from "sequelize";
import {
  Table,
  Column,
  Model,
  BelongsTo,
  ForeignKey,
  DataType,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";
import { Class, User } from "./entities";

@Table({ tableName: "Notifications", timestamps: true })
export class Notification extends Model<Notification> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({ 
    type: DataType.TEXT, 
    allowNull: true 
  })
  text: string;

  @Column({ 
    type: DataType.BOOLEAN, 
    defaultValue: false,
    allowNull: false
  })
  isViewed: boolean;
  
  @ForeignKey(() => Class)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  classId: string;

  @BelongsTo(() => Class)
  class: Class;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  userId: string;

  @BelongsTo(() => User)
  user: User;

  @CreatedAt
  declare creationDate: CreationOptional<Date>;

  @UpdatedAt
  declare lastUpdateDate: CreationOptional<Date>;

}