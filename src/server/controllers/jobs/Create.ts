import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { date, number, object, string } from 'yup';

import { JobsProvider } from '../../database/providers';
import { validation } from '../../shared/middleware';
import { IJobCreatePayload } from '../../database/models';

interface IBodyProps extends IJobCreatePayload {}

export const createValidation = validation((getSchema) => ({
    body: getSchema<IBodyProps>(
        object({
            nDoc: string().required(),
            title: string().required(),
            project: string().required(),
            status: string().required(),
            jobSituation: string().optional(),
            deadline: date().required(),
            responsibleId: number().required(),
        })
    ),
}));

export const create = async (
    req: Request<{}, {}, IBodyProps>,
    res: Response
) => {
    const result = await JobsProvider.create(req.body);
    if (result instanceof Error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ errors: { default: result.message } });
    }
    return res.status(StatusCodes.CREATED).json(result);
};
