import * as jobsComparison from './JobsComparison';
import * as jobsAverageTime from './JobsAverageTime';
import * as jobsChangePercentage from './JobsChangePercentage';
import * as analyticsWithComparison from './AnalyticsWithComparison';
import * as userJobsStats from './UserJobsStats';

export const AnalyticsController = {
    ...jobsComparison,
    ...analyticsWithComparison,
    ...jobsAverageTime,
    ...jobsChangePercentage,
    ...userJobsStats,
};
