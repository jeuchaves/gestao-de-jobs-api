import { Router } from 'express';
import { ensureAuthenticated } from '../shared/middleware';
import { AnalyticsController } from '../controllers';

const analyticsRouter = Router();

analyticsRouter.get(
    '/analytics/remaining-jobs',
    ensureAuthenticated,
    AnalyticsController.remainingJobs
);

analyticsRouter.get(
    '/analytics/completed-jobs',
    ensureAuthenticated,
    AnalyticsController.completedJobsValidation,
    AnalyticsController.completedJobs
);

analyticsRouter.get(
    '/analytics/jobs-average-time',
    ensureAuthenticated,
    AnalyticsController.jobsAverageTimeValidation,
    AnalyticsController.jobsAverageTime
);

analyticsRouter.get(
    '/analytics/jobs-change-percentage',
    ensureAuthenticated,
    AnalyticsController.jobsChangePercentageValidation,
    AnalyticsController.jobsChangePercentage
);

analyticsRouter.get(
    '/analytics/user-jobs-stats',
    ensureAuthenticated,
    AnalyticsController.userJobsStatsValidation,
    AnalyticsController.userJobsStats
);

export { analyticsRouter };
