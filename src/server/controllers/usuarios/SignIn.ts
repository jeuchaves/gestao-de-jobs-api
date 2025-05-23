import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { object, string } from 'yup';

import { validation } from '../../shared/middleware';
import { UsuariosProvider } from '../../database/providers';
import { IUsuario } from '../../database/models';
import { JWTService, PasswordCrypto } from '../../shared/services';

interface IBodyProps extends Pick<IUsuario, 'email' | 'senha'> {}

export const signInValidation = validation((getSchema) => ({
    body: getSchema<IBodyProps>(
        object({
            email: string().required().email().min(5),
            senha: string().required().min(6),
        })
    ),
}));

export const signIn = async (
    req: Request<{}, {}, IBodyProps>,
    res: Response
) => {
    const { email, senha } = req.body;

    const usuario = await UsuariosProvider.getByEmail(email);
    if (usuario instanceof Error) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            errors: {
                default: 'Email ou senha inválidos',
            },
        });
    }

    const passwordMatch = await PasswordCrypto.verifyPassword(
        senha,
        usuario.senha
    );
    if (!passwordMatch) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            errors: {
                default: 'Email ou senha inválidos',
            },
        });
    } else {
        const accessToken = JWTService.sign({ uid: usuario.id });
        if (accessToken === 'JWT_SECRET_NOT_FOUND') {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                errors: {
                    default: 'Erro ao gerar o token de acesso',
                },
            });
        }
        return res.status(StatusCodes.OK).json({ accessToken, usuario });
    }
};
