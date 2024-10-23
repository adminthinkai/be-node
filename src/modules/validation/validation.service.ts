import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Attributes, WhereOptions } from "sequelize";
import { IGetWithCreated } from "./types/IGetWithCreated";
import { Model} from "sequelize-typescript";

@Injectable()
export class ValidationService {
  async getModelWithThrow<T extends Model>({
    modelCtor,
    message,
    criteria,
    attributes = ["id"],
    include,
    paranoid = true,
  }: IGetWithCreated<T>) {
    const response = await modelCtor.findOne({
      where: criteria as WhereOptions<Attributes<T>>,
      attributes,
      include,
      paranoid,
    });

    if (!response) {
      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }

    return response;
  }
}
