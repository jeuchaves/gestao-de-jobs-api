import { number, object, string } from 'yup';
import { TRoles, TSectors } from '../../database/models';
import { validation } from '../../shared/middleware';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UsuariosProvider } from '../../database/providers';

interface IParamProps {
    id?: number;
}

interface IBodyProps {
    nomeCompleto: string;
    email: string;
    senha: string;
    role: TRoles;
    sector: TSectors;
}

export const updateByIdValidation = validation((getSchema) => ({
    params: getSchema<IParamProps>(
        object({
            id: number().moreThan(0).required().integer(),
        })
    ),
    body: getSchema<IBodyProps>(
        object({
            nomeCompleto: string().required(),
            email: string().required(),
            senha: string().required(),
            role: string().oneOf(['admin', 'collaborator', 'guest']).required(),
            sector: string()
                .oneOf(['digital', 'creative', 'finance', 'customer_service'])
                .required(),
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

    const result = await UsuariosProvider.updateById(req.params.id, req.body);
    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message,
            },
        });
    }
    return res.status(StatusCodes.NO_CONTENT).json({});
};
