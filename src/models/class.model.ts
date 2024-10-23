import { CreationOptional } from "sequelize";
import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  HasMany,
  Default,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { ClassHistory, User, Notification} from "./entities";

import { ClassCategory } from "./enum/ClassCategory";

@Table({ tableName: "Classes", timestamps: true})
export class Class extends Model<Class> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  id: string;

  @Column({type: DataType.TEXT})
  name: string;

  @Column({type: DataType.TEXT})
  description: string;

  @Column({type: DataType.TEXT})
  prompt: string;

  @Column({type: DataType.INTEGER})
  iconNumber: number;

  @Column({
    type: DataType.ENUM(...Object.values(ClassCategory)),
    defaultValue: ClassCategory.OTHER,
    allowNull: false
  })
  category: ClassCategory;

  @Column({
    type: DataType.TEXT,
    allowNull: false
  })
  input1: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true
  })
  input2: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true
  })
  input3: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true
  })
  input4: string;

  @Column({type: DataType.TEXT, allowNull: true})
  placeholderInput1: string;

  @Column({type: DataType.TEXT, allowNull: true})
  placeholderInput2: string;

  @Column({type: DataType.TEXT, allowNull: true})
  placeholderInput3: string;

  @Column({type: DataType.TEXT, allowNull: true})
  placeholderInput4: string;

  @Column({type: DataType.TEXT, allowNull: true})
  valueInput1: string;

  @Column({type: DataType.TEXT, allowNull: true})
  valueInput2: string;

  @Column({type: DataType.TEXT, allowNull: true})
  valueInput3: string;

  @Column({type: DataType.TEXT, allowNull: true})
  valueInput4: string;

  @Default(true)
  @Column({ type: DataType.BOOLEAN, allowNull: true })
  public: boolean;

  @Column({
    type: DataType.TEXT
  })
  content: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
  })
  creatorId: string;

  @BelongsTo(() => User)
  creator: User;

  @HasMany(() => ClassHistory)
  classHistory: ClassHistory[];

  @HasMany(() => Notification)
  notifications: Notification[];

  @CreatedAt
  declare creationDate: CreationOptional<Date>;

  @UpdatedAt
  declare lastUpdateDate: CreationOptional<Date>;

}