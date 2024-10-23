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
import { Class, User } from "./entities";


@Table({ tableName: "ClassHistory", timestamps: true})
export class ClassHistory extends Model<ClassHistory> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  id: string;

  @ForeignKey(() => Class)
  @Column({
    type: DataType.UUID,
  })
  classId: string;

  @BelongsTo(() => Class)
  class: Class;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
  })
  creatorId: string;

  @BelongsTo(() => User)
  creator: User;

  @Column({
    type: DataType.TEXT,
    allowNull: true
  })
  content: string;

  @CreatedAt
  declare creationDate: CreationOptional<Date>;

  @UpdatedAt
  declare lastUpdateDate: CreationOptional<Date>;

}