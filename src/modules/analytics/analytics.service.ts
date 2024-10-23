import { Injectable } from '@nestjs/common';
import { ChatsMessages, Class, ClassHistory, User } from 'src/models/entities';
import { UserStatus } from 'src/models/enum/UserStatus';
import { Op } from 'sequelize';
import * as moment from 'moment';
import { ChatRole } from 'src/models/enum/ChatRole';

@Injectable()
export class AnalyticsService {
  constructor() {}

  async getAnalyticsForAdmin() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const oneDayAgo = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 1,
    );
    const twoDaysAgo = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 2,
    );
    const threeDaysAgo = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 3,
    );
    const fourDaysAgo = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 4,
    );
    const fiveDaysAgo = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 5,
    );
    const sixDaysAgo = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 6,
    );

    const totalUsersCount = await User.count();
    const activeUsersThisMonthCount = await User.count({
      where: {
        lastActivity: {
          [Op.gte]: moment().subtract(1, 'months').toDate(),
        },
      },
    });

    const userСountries = await User.findAll({
      attributes: ['country'],
    });

    const counts = userСountries.reduce((acc, obj) => {
      const country = obj.country;
      if (acc[country]) {
        acc[country]++;
      } else {
        acc[country] = 1;
      }
      return acc;
    }, {});

    const countryPercentages = Object.keys(counts).reduce((acc, country) => {
      acc[country] =
        ((counts[country] / totalUsersCount) * 100).toFixed(2) + '%';
      return acc;
    }, {});

    const newUsers5Month = await User.count({
      where: {
        creationDate: {
          [Op.between]: [
            moment().subtract(6, 'months').toDate(),
            moment().subtract(5, 'months').toDate(),
          ],
        },
      },
    });

    const newUsers4Month = await User.count({
      where: {
        creationDate: {
          [Op.between]: [
            moment().subtract(5, 'months').toDate(),
            moment().subtract(4, 'months').toDate(),
          ],
        },
      },
    });

    const newUsers3Month = await User.count({
      where: {
        creationDate: {
          [Op.between]: [
            moment().subtract(4, 'months').toDate(),
            moment().subtract(3, 'months').toDate(),
          ],
        },
      },
    });

    const newUsers2Month = await User.count({
      where: {
        creationDate: {
          [Op.between]: [
            moment().subtract(3, 'months').toDate(),
            moment().subtract(2, 'months').toDate(),
          ],
        },
      },
    });

    const newUsers1Month = await User.count({
      where: {
        creationDate: {
          [Op.between]: [
            moment().subtract(2, 'months').toDate(),
            moment().subtract(1, 'months').toDate(),
          ],
        },
      },
    });

    const newUsersThisMonth = await User.count({
      where: {
        creationDate: {
          [Op.gte]: moment().subtract(1, 'months').toDate(),
        },
      },
    });

    const newUsers6Day = await User.count({
      where: {
        creationDate: {
          [Op.between]: [sixDaysAgo, fiveDaysAgo],
        },
      },
    });

    const newUsers5Day = await User.count({
      where: {
        creationDate: {
          [Op.between]: [fiveDaysAgo, fourDaysAgo],
        },
      },
    });

    const newUsers4Day = await User.count({
      where: {
        creationDate: {
          [Op.between]: [fourDaysAgo, threeDaysAgo],
        },
      },
    });

    const newUsers3Day = await User.count({
      where: {
        creationDate: {
          [Op.between]: [threeDaysAgo, twoDaysAgo],
        },
      },
    });

    const newUsers2Day = await User.count({
      where: {
        creationDate: {
          [Op.between]: [twoDaysAgo, oneDayAgo],
        },
      },
    });

    const newUsers1Day = await User.count({
      where: {
        creationDate: {
          [Op.between]: [oneDayAgo, today],
        },
      },
    });

    const newUsersThisDay = await User.count({
      where: {
        creationDate: {
          [Op.gte]: today,
        },
      },
    });

    const signUpUsers5Month = await User.count({
      where: {
        signUpDate: {
          [Op.between]: [
            moment().subtract(6, 'months').toDate(),
            moment().subtract(5, 'months').toDate(),
          ],
        },
      },
    });

    const signUpUsers4Month = await User.count({
      where: {
        signUpDate: {
          [Op.between]: [
            moment().subtract(5, 'months').toDate(),
            moment().subtract(4, 'months').toDate(),
          ],
        },
      },
    });

    const signUpUsers3Month = await User.count({
      where: {
        signUpDate: {
          [Op.between]: [
            moment().subtract(4, 'months').toDate(),
            moment().subtract(3, 'months').toDate(),
          ],
        },
      },
    });

    const signUpUsers2Month = await User.count({
      where: {
        signUpDate: {
          [Op.between]: [
            moment().subtract(3, 'months').toDate(),
            moment().subtract(2, 'months').toDate(),
          ],
        },
      },
    });

    const signUpUsers1Month = await User.count({
      where: {
        signUpDate: {
          [Op.between]: [
            moment().subtract(2, 'months').toDate(),
            moment().subtract(1, 'months').toDate(),
          ],
        },
      },
    });

    const signUpUsersThisMonth = await User.count({
      where: {
        signUpDate: {
          [Op.gte]: moment().subtract(1, 'months').toDate(),
        },
      },
    });

    const signUpUsers6Day = await User.count({
      where: {
        signUpDate: {
          [Op.between]: [sixDaysAgo, fiveDaysAgo],
        },
      },
    });

    const signUpUsers5Day = await User.count({
      where: {
        signUpDate: {
          [Op.between]: [fiveDaysAgo, fourDaysAgo],
        },
      },
    });

    const signUpUsers4Day = await User.count({
      where: {
        signUpDate: {
          [Op.between]: [fourDaysAgo, threeDaysAgo],
        },
      },
    });

    const signUpUsers3Day = await User.count({
      where: {
        signUpDate: {
          [Op.between]: [threeDaysAgo, twoDaysAgo],
        },
      },
    });

    const signUpUsers2Day = await User.count({
      where: {
        signUpDate: {
          [Op.between]: [twoDaysAgo, oneDayAgo],
        },
      },
    });

    const signUpUsers1Day = await User.count({
      where: {
        signUpDate: {
          [Op.between]: [oneDayAgo, today],
        },
      },
    });

    const signUpUsersThisDay = await User.count({
      where: {
        signUpDate: {
          [Op.gte]: today,
        },
      },
    });

    const createdClasses5Month = await Class.count({
      where: {
        creationDate: {
          [Op.between]: [
            moment().subtract(6, 'months').toDate(),
            moment().subtract(5, 'months').toDate(),
          ],
        },
      },
    });

    const createdClasses4Month = await Class.count({
      where: {
        creationDate: {
          [Op.between]: [
            moment().subtract(5, 'months').toDate(),
            moment().subtract(4, 'months').toDate(),
          ],
        },
      },
    });

    const createdClasses3Month = await Class.count({
      where: {
        creationDate: {
          [Op.between]: [
            moment().subtract(4, 'months').toDate(),
            moment().subtract(3, 'months').toDate(),
          ],
        },
      },
    });

    const createdClasses2Month = await Class.count({
      where: {
        creationDate: {
          [Op.between]: [
            moment().subtract(3, 'months').toDate(),
            moment().subtract(2, 'months').toDate(),
          ],
        },
      },
    });

    const createdClasses1Month = await Class.count({
      where: {
        creationDate: {
          [Op.between]: [
            moment().subtract(2, 'months').toDate(),
            moment().subtract(1, 'months').toDate(),
          ],
        },
      },
    });

    const createdClassesThisMonth = await Class.count({
      where: {
        creationDate: {
          [Op.gte]: moment().subtract(1, 'months').toDate(),
        },
      },
    });

    const createdClasses6Day = await Class.count({
      where: {
        creationDate: {
          [Op.between]: [sixDaysAgo, fiveDaysAgo],
        },
      },
    });

    const createdClasses5Day = await Class.count({
      where: {
        creationDate: {
          [Op.between]: [fiveDaysAgo, fourDaysAgo],
        },
      },
    });

    const createdClasses4Day = await Class.count({
      where: {
        creationDate: {
          [Op.between]: [fourDaysAgo, threeDaysAgo],
        },
      },
    });

    const createdClasses3Day = await Class.count({
      where: {
        creationDate: {
          [Op.between]: [threeDaysAgo, twoDaysAgo],
        },
      },
    });

    const createdClasses2Day = await Class.count({
      where: {
        creationDate: {
          [Op.between]: [twoDaysAgo, oneDayAgo],
        },
      },
    });

    const createdClasses1Day = await Class.count({
      where: {
        creationDate: {
          [Op.between]: [oneDayAgo, today],
        },
      },
    });

    const createdClassesThisDay = await Class.count({
      where: {
        creationDate: {
          [Op.gte]: today,
        },
      },
    });

    const generatedContent5Month = await ClassHistory.count({
      where: {
        creationDate: {
          [Op.between]: [
            moment().subtract(6, 'months').toDate(),
            moment().subtract(5, 'months').toDate(),
          ],
        },
      },
    });

    const generatedContent4Month = await ClassHistory.count({
      where: {
        creationDate: {
          [Op.between]: [
            moment().subtract(5, 'months').toDate(),
            moment().subtract(4, 'months').toDate(),
          ],
        },
      },
    });

    const generatedContent3Month = await ClassHistory.count({
      where: {
        creationDate: {
          [Op.between]: [
            moment().subtract(4, 'months').toDate(),
            moment().subtract(3, 'months').toDate(),
          ],
        },
      },
    });

    const generatedContent2Month = await ClassHistory.count({
      where: {
        creationDate: {
          [Op.between]: [
            moment().subtract(3, 'months').toDate(),
            moment().subtract(2, 'months').toDate(),
          ],
        },
      },
    });

    const generatedContent1Month = await ClassHistory.count({
      where: {
        creationDate: {
          [Op.between]: [
            moment().subtract(2, 'months').toDate(),
            moment().subtract(1, 'months').toDate(),
          ],
        },
      },
    });

    const generatedContentThisMonth = await ClassHistory.count({
      where: {
        creationDate: {
          [Op.gte]: moment().subtract(1, 'months').toDate(),
        },
      },
    });

    const generatedContent6Day = await ClassHistory.count({
      where: {
        creationDate: {
          [Op.between]: [sixDaysAgo, fiveDaysAgo],
        },
      },
    });

    const generatedContent5Day = await ClassHistory.count({
      where: {
        creationDate: {
          [Op.between]: [fiveDaysAgo, fourDaysAgo],
        },
      },
    });

    const generatedContent4Day = await ClassHistory.count({
      where: {
        creationDate: {
          [Op.between]: [fourDaysAgo, threeDaysAgo],
        },
      },
    });

    const generatedContent3Day = await ClassHistory.count({
      where: {
        creationDate: {
          [Op.between]: [threeDaysAgo, twoDaysAgo],
        },
      },
    });

    const generatedContent2Day = await ClassHistory.count({
      where: {
        creationDate: {
          [Op.between]: [twoDaysAgo, oneDayAgo],
        },
      },
    });

    const generatedContent1Day = await ClassHistory.count({
      where: {
        creationDate: {
          [Op.between]: [oneDayAgo, today],
        },
      },
    });

    const generatedContentThisDay = await ClassHistory.count({
      where: {
        creationDate: {
          [Op.gte]: today,
        },
      },
    });

    // const generatedContentByClassThisMonth = await ClassHistory.count({where:{
    //   creationDate: {
    //       [Op.gte]: moment().subtract(1, 'months').toDate()
    //     }
    // }});

    const lastUsersRequest = await ChatsMessages.findAndCountAll({
      where: { role: ChatRole.USER },
      attributes: ['id', 'message', 'userId', 'creationDate'],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'firstName', 'lastName'],
        },
      ],
      order: [['creationDate', 'DESC']],
      limit: 10,
    });

    const latestContentGeneration = await ClassHistory.findAndCountAll({
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'email', 'firstName', 'lastName'],
        },
        {
          model: Class,
          as: 'class',
          attributes: ['id', 'name', 'description'],
        },
      ],
      order: [['creationDate', 'DESC']],
      limit: 10,
    });

    const statusActiveUsersCount = await User.count({
      where: { status: UserStatus.ACTIVE },
    });
    const statusPendingUsersCount = await User.count({
      where: { status: UserStatus.PENDING },
    });
    const statusBlockedUsersCount = await User.count({
      where: { status: UserStatus.BLOCKED },
    });
    let percentActiveUsers =
      (activeUsersThisMonthCount / totalUsersCount) * 100;

    const lastSixMonthNamed = [
      moment().subtract(5, 'months').format('MMMM D'),
      moment().subtract(4, 'months').format('MMMM D'),
      moment().subtract(3, 'months').format('MMMM D'),
      moment().subtract(2, 'months').format('MMMM D'),
      moment().subtract(1, 'months').format('MMMM D'),
      moment().format('MMMM D'),
    ];

    const lastSevenDaysNamed = [
      moment().subtract(6, 'days').format('MMMM D'),
      moment().subtract(5, 'days').format('MMMM D'),
      moment().subtract(4, 'days').format('MMMM D'),
      moment().subtract(3, 'days').format('MMMM D'),
      moment().subtract(2, 'days').format('MMMM D'),
      moment().subtract(1, 'days').format('MMMM D'),
      moment().format('MMMM D'),
    ];

    const newUsersInTheLastSixMonths = [
      newUsers5Month,
      newUsers4Month,
      newUsers3Month,
      newUsers2Month,
      newUsers1Month,
      newUsersThisMonth,
    ];

    const newUsersInTheLastSevenDays = [
      newUsers6Day,
      newUsers5Day,
      newUsers4Day,
      newUsers3Day,
      newUsers2Day,
      newUsers1Day,
      newUsersThisDay,
    ];

    const signUpUsersInTheLastSixMonths = [
      signUpUsers5Month,
      signUpUsers4Month,
      signUpUsers3Month,
      signUpUsers2Month,
      signUpUsers1Month,
      signUpUsersThisMonth,
    ];

    const signUpUsersInTheLastSevenDays = [
      signUpUsers6Day,
      signUpUsers5Day,
      signUpUsers4Day,
      signUpUsers3Day,
      signUpUsers2Day,
      signUpUsers1Day,
      signUpUsersThisDay,
    ];

    const createdClassesInTheLastSixMonths = [
      createdClasses5Month,
      createdClasses4Month,
      createdClasses3Month,
      createdClasses2Month,
      createdClasses1Month,
      createdClassesThisMonth,
    ];

    const createdClassesInTheLastSevenDays = [
      createdClasses6Day,
      createdClasses5Day,
      createdClasses4Day,
      createdClasses3Day,
      createdClasses2Day,
      createdClasses1Day,
      createdClassesThisDay,
    ];

    const generatedContentInTheLastSixMonths = [
      generatedContent5Month,
      generatedContent4Month,
      generatedContent3Month,
      generatedContent2Month,
      generatedContent1Month,
      generatedContentThisMonth,
    ];

    const generatedContentInTheLastSevenDays = [
      generatedContent6Day,
      generatedContent5Day,
      generatedContent4Day,
      generatedContent3Day,
      generatedContent2Day,
      generatedContent1Day,
      generatedContentThisDay,
    ];

    return {
      lastSixMonthNamed,
      lastSevenDaysNamed,
      totalUsersCount,
      statusActiveUsersCount,
      statusPendingUsersCount,
      statusBlockedUsersCount,
      activeUsersThisMonthCount,
      percentActiveUsers,
      newUsersThisMonth,
      newUsersInTheLastSixMonths,
      newUsersInTheLastSevenDays,
      signUpUsersThisMonth,
      signUpUsersInTheLastSixMonths,
      signUpUsersInTheLastSevenDays,
      createdClassesThisMonth,
      createdClassesInTheLastSixMonths,
      createdClassesInTheLastSevenDays,
      generatedContentThisMonth,
      generatedContentInTheLastSixMonths,
      generatedContentInTheLastSevenDays,
      lastUsersRequest,
      latestContentGeneration,
      countryPercentages,
    };
  }

  async getAnalyticsForUser(userId: string) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const oneDayAgo = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 1,
    );
    const twoDaysAgo = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 2,
    );
    const threeDaysAgo = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 3,
    );
    const fourDaysAgo = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 4,
    );
    const fiveDaysAgo = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 5,
    );
    const sixDaysAgo = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 6,
    );

    const createdClassesActivity6Day = await Class.count({
      where: {
        creatorId: userId,
        creationDate: {
          [Op.between]: [sixDaysAgo, fiveDaysAgo],
        },
      },
    });

    const createdClassesActivity5Day = await Class.count({
      where: {
        creatorId: userId,
        creationDate: {
          [Op.between]: [fiveDaysAgo, fourDaysAgo],
        },
      },
    });

    const createdClassesActivity4Day = await Class.count({
      where: {
        creatorId: userId,
        creationDate: {
          [Op.between]: [fourDaysAgo, threeDaysAgo],
        },
      },
    });

    const createdClassesActivity3Day = await Class.count({
      where: {
        creatorId: userId,
        creationDate: {
          [Op.between]: [threeDaysAgo, twoDaysAgo],
        },
      },
    });

    const createdClassesActivity2Day = await Class.count({
      where: {
        creatorId: userId,
        creationDate: {
          [Op.between]: [twoDaysAgo, oneDayAgo],
        },
      },
    });

    const createdClassesActivity1Day = await Class.count({
      where: {
        creatorId: userId,
        creationDate: {
          [Op.between]: [oneDayAgo, today],
        },
      },
    });

    const createdClassesActivityThisDay = await Class.count({
      where: {
        creatorId: userId,
        creationDate: {
          [Op.gte]: today,
        },
      },
    });

    const createdClassesInTheLastSevenDays = await Class.findAll({
      where: {
        creatorId: userId,
        creationDate: {
          [Op.between]: [
            moment().subtract(6, 'days').toDate(),
            moment().subtract(0, 'days').toDate(),
          ],
        },
      },
      attributes: ['id', 'name', 'creationDate'],
      order: [['creationDate', 'DESC']],
    });

    const createdClassesThisDay = await Class.findAll({
      where: {
        creatorId: userId,
        creationDate: {
          [Op.gte]: today,
        },
      },
      attributes: ['id', 'name', 'creationDate'],
      order: [['creationDate', 'DESC']],
    });

    const requestsToChatActivity6Day = await ChatsMessages.count({
      where: {
        role: ChatRole.USER,
        userId,
        creationDate: {
          [Op.between]: [sixDaysAgo, fiveDaysAgo],
        },
      },
    });

    const requestsToChatActivity5Day = await ChatsMessages.count({
      where: {
        role: ChatRole.USER,
        userId,
        creationDate: {
          [Op.between]: [fiveDaysAgo, fourDaysAgo],
        },
      },
    });

    const requestsToChatActivity4Day = await ChatsMessages.count({
      where: {
        role: ChatRole.USER,
        userId,
        creationDate: {
          [Op.between]: [fourDaysAgo, threeDaysAgo],
        },
      },
    });

    const requestsToChatActivity3Day = await ChatsMessages.count({
      where: {
        role: ChatRole.USER,
        userId,
        creationDate: {
          [Op.between]: [threeDaysAgo, twoDaysAgo],
        },
      },
    });

    const requestsToChatActivity2Day = await ChatsMessages.count({
      where: {
        role: ChatRole.USER,
        userId,
        creationDate: {
          [Op.between]: [twoDaysAgo, oneDayAgo],
        },
      },
    });

    const requestsToChatActivity1Day = await ChatsMessages.count({
      where: {
        role: ChatRole.USER,
        userId,
        creationDate: {
          [Op.between]: [oneDayAgo, today],
        },
      },
    });

    const requestsToChatActivityThisDay = await ChatsMessages.count({
      where: {
        role: ChatRole.USER,
        userId,
        creationDate: {
          [Op.gte]: today,
        },
      },
    });

    const requestsToChatInTheLastSevenDays = await ChatsMessages.findAll({
      where: {
        role: ChatRole.USER,
        userId,
        creationDate: {
          [Op.between]: [
            moment().subtract(6, 'days').toDate(),
            moment().subtract(0, 'days').toDate(),
          ],
        },
      },
      attributes: ['id', 'message', 'creationDate'],
      order: [['creationDate', 'DESC']],
    });

    const requestsToChatThisDay = await ChatsMessages.findAll({
      where: {
        role: ChatRole.USER,
        userId,
        creationDate: {
          [Op.gte]: today,
        },
      },
      attributes: ['id', 'message', 'creationDate'],
      order: [['creationDate', 'DESC']],
    });

    const generatedContentActivity6Day = await ClassHistory.count({
      where: {
        creatorId: userId,
        creationDate: {
          [Op.between]: [sixDaysAgo, fiveDaysAgo],
        },
      },
    });

    const generatedContentActivity5Day = await ClassHistory.count({
      where: {
        creatorId: userId,
        creationDate: {
          [Op.between]: [fiveDaysAgo, fourDaysAgo],
        },
      },
    });

    const generatedContentActivity4Day = await ClassHistory.count({
      where: {
        creatorId: userId,
        creationDate: {
          [Op.between]: [fourDaysAgo, threeDaysAgo],
        },
      },
    });

    const generatedContentActivity3Day = await ClassHistory.count({
      where: {
        creatorId: userId,
        creationDate: {
          [Op.between]: [threeDaysAgo, twoDaysAgo],
        },
      },
    });

    const generatedContentActivity2Day = await ClassHistory.count({
      where: {
        creatorId: userId,
        creationDate: {
          [Op.between]: [twoDaysAgo, oneDayAgo],
        },
      },
    });

    const generatedContentActivity1Day = await ClassHistory.count({
      where: {
        creatorId: userId,
        creationDate: {
          [Op.between]: [oneDayAgo, today],
        },
      },
    });

    const generatedContentActivityThisDay = await ClassHistory.count({
      where: {
        creatorId: userId,
        creationDate: {
          [Op.gte]: today,
        },
      },
    });

    const generatedContentInTheLastSevenDays = await ClassHistory.findAll({
      where: {
        creatorId: userId,
        creationDate: {
          [Op.between]: [
            moment().subtract(6, 'days').toDate(),
            moment().subtract(0, 'days').toDate(),
          ],
        },
      },
      attributes: ['id', 'content', 'creationDate'],
      order: [['creationDate', 'DESC']],
    });

    const generatedContentThisDay = await ClassHistory.findAll({
      where: {
        creatorId: userId,
        creationDate: {
          [Op.gte]: today,
        },
      },
      attributes: ['id', 'content', 'creationDate'],
      order: [['creationDate', 'DESC']],
    });

    const lastSevenDays = [
      moment().subtract(6, 'days').format('MMMM D'),
      moment().subtract(5, 'days').format('MMMM D'),
      moment().subtract(4, 'days').format('MMMM D'),
      moment().subtract(3, 'days').format('MMMM D'),
      moment().subtract(2, 'days').format('MMMM D'),
      moment().subtract(1, 'days').format('MMMM D'),
      moment().format('MMMM D'),
    ];

    const createdClassesActivityInTheLastSevenDays = [
      createdClassesActivity6Day,
      createdClassesActivity5Day,
      createdClassesActivity4Day,
      createdClassesActivity3Day,
      createdClassesActivity2Day,
      createdClassesActivity1Day,
      createdClassesActivityThisDay,
    ];

    const requestsToChatActivityInTheLastSevenDays = [
      requestsToChatActivity6Day,
      requestsToChatActivity5Day,
      requestsToChatActivity4Day,
      requestsToChatActivity3Day,
      requestsToChatActivity2Day,
      requestsToChatActivity1Day,
      requestsToChatActivityThisDay,
    ];

    const generatedContentActivityInTheLastSevenDays = [
      generatedContentActivity6Day,
      generatedContentActivity5Day,
      generatedContentActivity4Day,
      generatedContentActivity3Day,
      generatedContentActivity2Day,
      generatedContentActivity1Day,
      generatedContentActivityThisDay,
    ];

    return {
      lastSevenDays,
      createdClassesThisDay,
      createdClassesInTheLastSevenDays,
      createdClassesActivityThisDay,
      createdClassesActivityInTheLastSevenDays,
      requestsToChatThisDay,
      requestsToChatInTheLastSevenDays,
      requestsToChatActivityThisDay,
      requestsToChatActivityInTheLastSevenDays,
      generatedContentThisDay,
      generatedContentInTheLastSevenDays,
      generatedContentActivityThisDay,
      generatedContentActivityInTheLastSevenDays,
    };
  }
}
