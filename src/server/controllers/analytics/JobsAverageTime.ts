import { Request, Response } from 'express';
import { IQueryAnalyticsProps } from './AnalyticsWithComparison';
import { StatusCodes } from 'http-status-codes';
import { AnalyticsProvider } from '../../database/providers';

export const jobsAverageTime = async (
    req: Request<{}, {}, {}, IQueryAnalyticsProps>,
    res: Response
) => {
    const { startDate, endDate, startDateComparison, endDateComparison } =
        req.query;

    if (!startDate || !endDate || !startDateComparison || !endDateComparison) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ errors: { message: 'Parâmetros inválidos.' } });
    }

    const result = await AnalyticsProvider.jobsAverageTime(startDate, endDate);

    const comparisonResult = await AnalyticsProvider.jobsAverageTime(
        startDateComparison,
        endDateComparison
    );

    if (result instanceof Error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send(result.message);
    }

    if (comparisonResult instanceof Error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send(comparisonResult.message);
    }

    return res.status(StatusCodes.OK).json({
        averageTime: result.total,
        comparisonAverageTime: comparisonResult.total,
    });
};
