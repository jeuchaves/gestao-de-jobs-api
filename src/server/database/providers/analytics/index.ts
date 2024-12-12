import * as jobsComparison from './JobsComparison';
import * as jobsAverageTime from './JobsAverageTime';

export const AnalyticsProvider = {
    ...jobsComparison,
    ...jobsAverageTime,
};
