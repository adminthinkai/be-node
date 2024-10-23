import { CreationOptional } from "sequelize";
import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from "sequelize-typescript";

import { AppBranding} from "./entities";

@Table({tableName: "Files", timestamps: true})
export class File extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  id: string;

  @Column({ type: DataType.TEXT, defaultValue: "filename" })
  name: string;

  @Column(DataType.TEXT)
  key: string;

  @Column(DataType.TEXT)
  url: string;

  @Column(DataType.TEXT)
  mimetype: string;

  @Column({ type: DataType.FLOAT, defaultValue: 0 })
  size: number;

  @ForeignKey(() => AppBranding)
  @Column({ type: DataType.UUID, allowNull: true })
  appLogoId: string;

  @BelongsTo(() => AppBranding)
  appLogo: AppBranding;

  @CreatedAt
  declare creationDate: CreationOptional<Date>;

  @UpdatedAt
  declare lastUpdateDate: CreationOptional<Date>;
}