import { Op } from "sequelize";
import { isNotEmptyArray } from "src/functions/isNotEmptyArray";

export const filterForFiles = async (params: any) => {
  const orCriteria = [];

  if (isNotEmptyArray(params.types)) {
    orCriteria.push({
      mimetype: {
        [Op.in]: params.types,
      },
    });
  }

  if (params.startSize && params.endSize) {
    orCriteria.push({
      size: {
        [Op.gte]: params.startSize,
        [Op.lte]: params.endSize,
      },
    });
  }

  if (params.startCreationDate && params.endCreationDate) {
    orCriteria.push({
      creationDate: {
        [Op.gte]: params.startCreationDate,
        [Op.lte]: params.endCreationDate,
      },
    });
  }

  if (params.keySearchValue) {
    orCriteria.push({
      [Op.or]: [
        { name: { [Op.iLike]: `%${params.keySearchValue}%` } },
      ],
    });
  }

  return orCriteria;
};