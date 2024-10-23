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
import { User } from "./entities";

@Table({ tableName: "UserCredentials", timestamps: true })
export class UserCredential extends Model {
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
  password: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  userId: string;

  @Column({ 
    type: DataType.TEXT, 
    allowNull: true 
  })
  refreshToken: string;

  @BelongsTo(() => User)
  user: User;

  @CreatedAt
  declare creationDate: CreationOptional<Date>;

  @UpdatedAt
  declare lastUpdateDate: CreationOptional<Date>;

}