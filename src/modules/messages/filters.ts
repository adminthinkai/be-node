import { Op } from "sequelize";
import { isNotEmptyArray } from "src/functions/isNotEmptyArray";

export const filterForClasses = async (params: any) => {
  const orCriteria = [];

  if (isNotEmptyArray(params.categories)) {
    orCriteria.push({
      category: {
        [Op.in]: params.categories,
      },
    });
  }

  if (params.keySearchValue) {
    orCriteria.push({
      [Op.or]: [
        { name: { [Op.iLike]: `%${params.keySearchValue}%` } },
        { description: { [Op.iLike]: `%${params.keySearchValue}%` } },
      ],
    });
  }

  return orCriteria;
};