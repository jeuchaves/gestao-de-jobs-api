import { Router } from 'express';
import { UsuariosController } from '../controllers';
import { ensureAuthenticated } from '../shared/middleware';

const usuariosRouter = Router();

usuariosRouter.get(
    '/usuarios',
    ensureAuthenticated,
    UsuariosController.getAllValidation,
    UsuariosController.getAll
);

export { usuariosRouter };
