import { Model, ModelCtor } from "sequelize-typescript";
import {
  Attributes,
  FindAttributeOptions,
  Includeable,
  WhereOptions,
} from "sequelize";

export interface IGetWithCreated<T extends Model> {
  criteria: WhereOptions<Attributes<T>> | { [key: string]: unknown };
  message: string;
  modelCtor: ModelCtor<T>;
  attributes?: FindAttributeOptions;
  include?: Includeable | Includeable[];
  paranoid?: boolean;
}
