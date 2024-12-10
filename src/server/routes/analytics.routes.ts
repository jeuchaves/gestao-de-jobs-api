import { Router } from 'express';
import { ensureAuthenticated } from '../shared/middleware';
import { AnalyticsController } from '../controllers';

const analyticsRouter = Router();

analyticsRouter.get(
    '/analytics/jobs-comparison',
    ensureAuthenticated,
    AnalyticsController.jobsComparisonValidation,
    AnalyticsController.jobsComparison
);

export { analyticsRouter };
