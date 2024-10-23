import { CreationOptional } from "sequelize";
import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";

@Table({ tableName: "VerificationCodes", timestamps: true })
export class Verification extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: true,
  })
  id: string;

  @Column({ 
    type: DataType.TEXT, 
    unique: true 
  })
  email: string;

  @Column({ 
    type: DataType.TEXT,
  })
  verificationCodeSignUp: string;

  @Column({ 
    type: DataType.TEXT,
  })
  verificationCodeRestorePassword: string;

  @Column({ type: DataType.DATE, allowNull: true })
  expirationDateSignUp: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  expirationDateRestorePassword: Date;

  @CreatedAt
  declare creationDate: CreationOptional<Date>;

  @UpdatedAt
  declare lastUpdateDate: CreationOptional<Date>;
}
