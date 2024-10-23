// import { CreationOptional } from "sequelize";
// import {
//   Table,
//   Column,
//   Model,
//   DataType,
//   CreatedAt,
//   UpdatedAt,
//   HasMany,
//   ForeignKey,
//   BelongsTo,
// } from "sequelize-typescript";
// import {
//   ChatsMessages,
//   User,
// } from "./entities";

// @Table({ tableName: "Chats", timestamps: true})
// export class Chat extends Model<Chat> {
//   @Column({
//     type: DataType.UUID,
//     defaultValue: DataType.UUIDV4,
//     primaryKey: true,
//     allowNull: false,
//   })
//   id: string;

//   @ForeignKey(() =>User)
//   @Column({ type: DataType.UUID, allowNull: true })
//   userId: string;

//   @BelongsTo(() => User)
//   user: User;
  
//   @HasMany(() => ChatsMessages)
//   messages: ChatsMessages[];

//   @CreatedAt
//   declare creationDate: CreationOptional<Date>;

//   @UpdatedAt
//   declare lastUpdateDate: CreationOptional<Date>;

// }