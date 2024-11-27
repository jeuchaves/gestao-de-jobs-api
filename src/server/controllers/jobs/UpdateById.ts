import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { boolean, date, number, object, string } from 'yup';

import { validation } from '../../shared/middleware';
import { IJob } from '../../database/models';
import { JobsProvider } from '../../database/providers';

interface IParamProps {
    id?: number;
}
interface IBodyProps extends Partial<Omit<IJob, 'id'>> {}

export const updateByIdValidation = validation((getSchema) => ({
    params: getSchema<IParamProps>(
        object({
            id: number().moreThan(0).required().integer(),
        })
    ),
    body: getSchema<IBodyProps>(
        object({
            nDoc: string().optional(),
            title: string().optional(),
            project: string().optional(),
            status: string().optional(),
            jobSituation: string().optional(),
            deadline: date().optional(),
            responsibleId: number().optional(),
            estimatedComplexity: string()
                .oneOf(['simple', 'regular', 'complex'])
                .optional(),
            isChangeRequest: boolean().optional(),
            timeSheet: number().optional(),
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

    const fieldsToUpdate: Partial<IBodyProps> = Object.fromEntries(
        Object.entries(req.body).filter(([, value]) => value !== undefined)
    );

    if (Object.keys(fieldsToUpdate).length === 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            errors: {
                default: 'Nenhum campo válido foi enviado para atualização',
            },
        });
    }

    const result = await JobsProvider.updateById(req.params.id, fieldsToUpdate);
    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message,
            },
        });
    }
    return res.status(StatusCodes.NO_CONTENT).json(result);
};
