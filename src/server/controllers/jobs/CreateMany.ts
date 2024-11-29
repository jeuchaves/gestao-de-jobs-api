import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { array, date, number, object, string } from 'yup';

import { JobsProvider } from '../../database/providers';
import { validation } from '../../shared/middleware';
import { IJobCreatePayload } from '../../database/models';

interface IBodyProps extends IJobCreatePayload {}

export const createManyValidation = validation((getSchema) => ({
    body: getSchema<{ jobs: IBodyProps[] }>(
        object({
            jobs: array(
                object({
                    nDoc: string().required(),
                    title: string().required(),
                    project: string().required(),
                    status: string().required(),
                    jobSituation: string().optional(),
                    deadline: date().required(),
                    responsibleId: number().required(),
                })
            ).required(),
        })
    ),
}));

export const createMany = async (
    req: Request<{}, {}, { jobs: IBodyProps[] }>,
    res: Response
) => {
    const { jobs } = req.body;

    const result = await JobsProvider.createMany(jobs);
    if (result instanceof Error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ errors: { default: result.message } });
    }
    return res.status(StatusCodes.CREATED).json(result);
};
