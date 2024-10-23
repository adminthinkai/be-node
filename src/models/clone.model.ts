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
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { User } from './entities';

@Table({ tableName: 'Clones', timestamps: true })
export class Clone extends Model<Clone> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  id: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  email: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  password: string;

  @Column({
    unique: true,
    type: DataType.TEXT,
    allowNull: false,
  })
  cloneName: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  servername: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  username: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  dbname: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  adminId: string;

  @BelongsTo(() => User)
  admin: User;

  @CreatedAt
  declare creationDate: CreationOptional<Date>;

  @UpdatedAt
  declare lastUpdateDate: CreationOptional<Date>;
}
