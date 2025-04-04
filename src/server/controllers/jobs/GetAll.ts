import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { number, object, string } from 'yup';

import { validation } from '../../shared/middleware';
import { JobsProvider } from '../../database/providers';

interface IQueryProps {
    page?: number;
    limit?: number;
    filter?: string;
    completed?: string;
    userId?: number;
}

export const getAllValidation = validation((getSchema) => ({
    query: getSchema<IQueryProps>(
        object({
            page: number().moreThan(0),
            limit: number().moreThan(0),
            filter: string(),
            completed: string().matches(/^(true|false)$/),
            userId: number().moreThan(0),
        })
    ),
}));

export const getAll = async (
    req: Request<{}, {}, {}, IQueryProps>,
    res: Response
) => {
    const completed =
        req.query.completed === undefined
            ? false
            : req.query.completed === 'true';

    const result = await JobsProvider.getAll(
        req.query.page || 1,
        req.query.limit || 10,
        req.query.filter || '',
        completed,
        req.query.userId
    );
    const count = await JobsProvider.count(req.query.filter, completed);

    if (result instanceof Error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send(result.message);
    } else if (count instanceof Error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send(count.message);
    }

    res.setHeader('access-control-expose-headers', 'x-total-count');
    res.setHeader('x-total-count', count);

    return res.status(StatusCodes.OK).json(result);
};
