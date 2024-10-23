import { CreationOptional } from "sequelize";
import {
  Table,
  Column,
  Model,
  HasOne,
  DataType,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";

import {
  File,
} from "./entities";

import { BackgroundColorType } from "./enum/BackgroundColorType";

@Table({ tableName: "AppBranding", timestamps: true})
export class AppBranding extends Model<AppBranding> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false
  })
  id: string;

  @Column({
    type: DataType.TEXT,
    defaultValue: "Think AI",
    allowNull: false
  })
  name: string;

  @Column({
    type: DataType.TEXT, 
    defaultValue: "#56c596",
    allowNull: false
  })
  primaryColor: string;

  @Column({
    type: DataType.ENUM(...Object.values(BackgroundColorType)),
    defaultValue: BackgroundColorType.GRADIENT,
    allowNull: false
  })
  backgroundColorType: BackgroundColorType;

  @Column({
    type: DataType.TEXT, 
    defaultValue: "#329D9C",
    allowNull: false
  })
  backgroundColorFirst: string;

  @Column({
    type: DataType.TEXT, 
    defaultValue: "#205072",
    allowNull: false,
  })
  backgroundColorSecond: string;

  @Column({ 
    type: DataType.BOOLEAN, 
    defaultValue: true,
    allowNull: false
  })
  usingInternalData: boolean;
  
  @HasOne(() => File, 'appLogoId')
  logo: File;

  @CreatedAt
  declare creationDate: CreationOptional<Date>;

  @UpdatedAt
  declare lastUpdateDate: CreationOptional<Date>;

}