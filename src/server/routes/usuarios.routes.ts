import { Router } from 'express';
import { UsuariosController } from '../controllers';

const usuariosRouter = Router();

usuariosRouter.post(
    '/entrar',
    UsuariosController.signInValidation,
    UsuariosController.signIn
);

usuariosRouter.post(
    '/cadastrar',
    UsuariosController.signUpValidation,
    UsuariosController.signUp
);

export { usuariosRouter };
