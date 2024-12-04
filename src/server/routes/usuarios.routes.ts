import { Router } from 'express';
import { UsuariosController } from '../controllers';

const usuariosRouter = Router();

usuariosRouter.get('/usuarios', UsuariosController.getAll);

export { usuariosRouter };
