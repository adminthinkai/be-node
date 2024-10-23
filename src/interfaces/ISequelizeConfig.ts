export interface ISequelizeConfig {
  SEQUELIZE_HOST: string;
  SEQUELIZE_USERNAME: string;
  SEQUELIZE_DB: string;
  SEQUELIZE_PASSWORD: string;
  SEQUELIZE_PORT: number;
  SEQUELIZE_IS_LOGGING: number;
  SEQUELIZE_SYNC_OPTION: "alter" | "force";
  SEQUELIZE_IS_SYNC: number;
  SEQUELIZE_IS_AUTOLOAD: number;
  SEQUELIZE_DIALECT_OPTIONS: string;
}
