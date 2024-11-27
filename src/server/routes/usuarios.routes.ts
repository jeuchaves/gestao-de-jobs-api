import { Router } from 'express';
import { UsuariosController } from '../controllers';

const usuariosRouter = Router();

usuariosRouter.post(
    '/auth/login',
    UsuariosController.signInValidation,
    UsuariosController.signIn
);

usuariosRouter.post(
    '/auth/signup',
    UsuariosController.signUpValidation,
    UsuariosController.signUp
);

export { usuariosRouter };
