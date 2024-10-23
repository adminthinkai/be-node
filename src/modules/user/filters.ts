import { Op, Sequelize } from "sequelize";
import { isNotEmptyArray } from "src/functions/isNotEmptyArray";

export const filterForUsers = async (params: any) => {
  const orCriteria = [];

  if (params.role) {
    orCriteria.push({
      role: params.role,
    });
  }

  if (isNotEmptyArray(params.statuses)) {
    orCriteria.push({
      status: {
        [Op.in]: params.statuses,
      },
    });
  }

  if (params.startLastActivity && params.endLastActivity) {
    orCriteria.push({
      lastActivity: {
        [Op.gte]: params.startLastActivity,
        [Op.lte]: params.endLastActivity,
      },
    });
  }

  if (params.keySearchValue) {
    orCriteria.push({
      [Op.or]: [
        { email: { [Op.iLike]: `%${params.keySearchValue}%` } },
        {
          [Op.or]: [
            Sequelize.where(
              Sequelize.fn(
                "concat",
                Sequelize.col("firstName"),
                " ",
                Sequelize.col("lastName")
              ),
              {
                [Op.iLike]: `%${params.keySearchValue}%`,
              }
            ),
            Sequelize.where(
              Sequelize.fn(
                "concat",
                Sequelize.col("lastName"),
                " ",
                Sequelize.col("firstName")
              ),
              {
                [Op.iLike]: `%${params.keySearchValue}%`,
              }
            ),
          ],
        },
      ],
    });
  }

  return orCriteria;
};