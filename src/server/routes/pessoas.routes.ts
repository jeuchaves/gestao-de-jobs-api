import { Router } from 'express';

import { ensureAuthenticated } from '../shared/middleware';
import { PessoasController } from '../controllers';

const pessoasRouter = Router();

pessoasRouter
    .get(
        '/pessoas',
        ensureAuthenticated,
        PessoasController.getAllValidation,
        PessoasController.getAll
    )
    .post(
        '/pessoas',
        ensureAuthenticated,
        PessoasController.createValidation,
        PessoasController.create
    );

pessoasRouter
    .get(
        '/pessoas/:id',
        ensureAuthenticated,
        PessoasController.getByIdValidation,
        PessoasController.getById
    )
    .put(
        '/pessoas/:id',
        ensureAuthenticated,
        PessoasController.updateByIdValidation,
        PessoasController.updateById
    )
    .delete(
        '/pessoas/:id',
        ensureAuthenticated,
        PessoasController.deleteByIdValidation,
        PessoasController.deleteById
    );

export { pessoasRouter };
