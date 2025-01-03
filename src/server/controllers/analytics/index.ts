import * as jobsComparison from './JobsComparison';
import * as jobsAverageTime from './JobsAverageTime';
import * as jobsChangePercentage from './JobsChangePercentage';
import * as analyticsWithComparison from './AnalyticsWithComparison';
import * as userJobsStats from './UserJobsStats';
import * as completedJobs from './CompletedJobs';

export const AnalyticsController = {
    ...jobsComparison,
    ...analyticsWithComparison,
    ...jobsAverageTime,
    ...jobsChangePercentage,
    ...userJobsStats,
    ...completedJobs,
};
