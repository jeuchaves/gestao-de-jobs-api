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

export { analyticsRouter };
