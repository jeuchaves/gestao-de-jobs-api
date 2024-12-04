import { Router } from 'express';
import { UsuariosController } from '../controllers';

const authRouter = Router();

authRouter.post(
    '/auth/login',
    UsuariosController.signInValidation,
    UsuariosController.signIn
);

authRouter.post(
    '/auth/signup',
    UsuariosController.signUpValidation,
    UsuariosController.signUp
);

export { authRouter };
