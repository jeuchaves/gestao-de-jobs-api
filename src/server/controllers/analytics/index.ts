import * as jobsComparison from './JobsComparison';
import * as jobsAverageTime from './JobsAverageTime';
import * as analytics from './Analytics';

export const AnalyticsController = {
    ...jobsComparison,
    ...analytics,
    ...jobsAverageTime,
};
