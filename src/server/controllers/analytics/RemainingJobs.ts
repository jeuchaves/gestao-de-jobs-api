import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { AnalyticsProvider } from '../../database/providers';
import { validation } from '../../shared/middleware';
import { number, object } from 'yup';

interface IRemainingJobsProps {
    responsibleId?: number;
}

export const remainingJobsValidation = validation((getSchema) => ({
    query: getSchema<IRemainingJobsProps>(
        object({
            responsibleId: number().optional(),
        })
    ),
}));

export const remainingJobs = async (
    req: Request<{}, {}, {}, IRemainingJobsProps>,
    res: Response
) => {
    const { responsibleId } = req.query;

    const result = await AnalyticsProvider.remainingJobs(responsibleId);

    if (result instanceof Error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send(result.message);
    }

    return res.status(StatusCodes.OK).json(result);
};
