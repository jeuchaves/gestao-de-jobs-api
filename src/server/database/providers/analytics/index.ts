import * as jobsComparison from './JobsComparison';
import * as jobsAverageTime from './JobsAverageTime';
import * as jobsChangePercentage from './JobsChangePercentage';
import * as userJobsStats from './UserJobsStats';
import * as completedJobs from './CompletedJobs';

export const AnalyticsProvider = {
    ...jobsComparison,
    ...jobsAverageTime,
    ...jobsChangePercentage,
    ...userJobsStats,
    ...completedJobs,
};
