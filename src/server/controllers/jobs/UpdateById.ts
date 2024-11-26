import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { boolean, date, number, object, string } from 'yup';

import { validation } from '../../shared/middleware';
import { IJob } from '../../database/models';
import { JobsProvider } from '../../database/providers';

interface IParamProps {
    id?: number;
}
interface IBodyProps extends Omit<IJob, 'id'> {}

export const updateByIdValidation = validation((getSchema) => ({
    params: getSchema<IParamProps>(
        object({
            id: number().moreThan(0).required().integer(),
        })
    ),
    body: getSchema<IBodyProps>(
        object({
            nDoc: string().required(),
            title: string().required(),
            project: string().required(),
            status: string().required(),
            jobSituation: string().optional(),
            deadline: date().required(),
            responsibleId: number().required(),
            estimatedComplexity: string()
                .oneOf(['simple', 'regular', 'complex'])
                .optional(),
            isChangeRequest: boolean().required(),
            timeSheet: number().required(),
            actualComplexity: string()
                .oneOf(['simple', 'regular', 'complex'])
                .optional(),
            contingencies: string().optional(),
            createdAt: date().optional(),
            updatedAt: date().optional(),
        })
    ),
}));

export const updateById = async (
    req: Request<IParamProps, {}, IBodyProps>,
    res: Response
) => {
    if (!req.params.id) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            errors: {
                default: 'O parâmetro "id" precisa ser informado.',
            },
        });
    }

    const result = await JobsProvider.updateById(req.params.id, req.body);
    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message,
            },
        });
    }
    return res.status(StatusCodes.NO_CONTENT).json(result);
};
