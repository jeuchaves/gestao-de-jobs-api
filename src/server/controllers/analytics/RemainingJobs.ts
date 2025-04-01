import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { AnalyticsProvider } from '../../database/providers';

export const remainingJobs = async (req: Request, res: Response) => {
    const result = await AnalyticsProvider.remainingJobs();

    if (result instanceof Error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send(result.message);
    }

    return res.status(StatusCodes.OK).json(result);
};
