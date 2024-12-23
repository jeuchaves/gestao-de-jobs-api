import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { object, string } from 'yup';

import { UsuariosProvider } from '../../database/providers';
import { validation } from '../../shared/middleware';
import { IUsuario } from '../../database/models';

interface IBodyProps extends Omit<IUsuario, 'id' | 'createdAt' | 'updatedAt'> {}

export const signUpValidation = validation((getSchema) => ({
    body: getSchema<IBodyProps>(
        object({
            nomeCompleto: string().required().min(3),
            email: string().required().email().min(5),
            senha: string().required().min(6),
            role: string().oneOf(['admin', 'collaborator', 'guest']).required(),
            sector: string()
                .oneOf(['digital', 'creative', 'finance', 'customer_service'])
                .required(),
        })
    ),
}));

export const signUp = async (
    req: Request<{}, {}, IBodyProps>,
    res: Response
) => {
    const result = await UsuariosProvider.create(req.body);
    if (result instanceof Error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ errors: { default: result.message } });
    }
    return res.status(StatusCodes.CREATED).json(result);
};
