import * as remainingJobs from './RemainingJobs';
import * as jobsAverageTime from './JobsAverageTime';
import * as jobsChangePercentage from './JobsChangePercentage';
import * as analyticsWithComparison from './AnalyticsWithComparison';
import * as userJobsStats from './UserJobsStats';
import * as completedJobs from './CompletedJobs';

export const AnalyticsController = {
    ...remainingJobs,
    ...analyticsWithComparison,
    ...jobsAverageTime,
    ...jobsChangePercentage,
    ...userJobsStats,
    ...completedJobs,
};
