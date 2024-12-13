import { Router } from 'express';
import { ensureAuthenticated } from '../shared/middleware';
import { AnalyticsController } from '../controllers';

const analyticsRouter = Router();

analyticsRouter.get(
    '/analytics/jobs-comparison',
    ensureAuthenticated,
    AnalyticsController.analyticsValidation,
    AnalyticsController.jobsComparison
);

analyticsRouter.get(
    '/analytics/jobs-average-time',
    ensureAuthenticated,
    AnalyticsController.analyticsValidation,
    AnalyticsController.jobsAverageTime
);

analyticsRouter.get(
    '/analytics/jobs-change-percentage',
    ensureAuthenticated,
    AnalyticsController.analyticsValidation,
    AnalyticsController.jobsChangePercentage
);

analyticsRouter.get(
    '/analytics/user-jobs-stats',
    ensureAuthenticated,
    AnalyticsController.userJobsStatsValidation,
    AnalyticsController.userJobsStats
);

export { analyticsRouter };
