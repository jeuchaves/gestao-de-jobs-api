import * as remainingJobs from './RemainingJobs';
import * as jobsAverageTime from './JobsAverageTime';
import * as jobsChangePercentage from './JobsChangePercentage';
import * as userJobsStats from './UserJobsStats';
import * as completedJobs from './CompletedJobs';

export const AnalyticsProvider = {
    ...remainingJobs,
    ...jobsAverageTime,
    ...jobsChangePercentage,
    ...userJobsStats,
    ...completedJobs,
};
