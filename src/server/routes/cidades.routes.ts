import { Router } from 'express';

import { ensureAuthenticated } from '../shared/middleware';
import { CidadesController } from '../controllers';

const cidadesRouter = Router();

cidadesRouter
    .post(
        '/cidades',
        ensureAuthenticated,
        CidadesController.createValidation,
        CidadesController.create
    )
    .get(
        '/cidades',
        ensureAuthenticated,
        CidadesController.getAllValidation,
        CidadesController.getAll
    );

cidadesRouter
    .delete(
        '/cidades/:id',
        ensureAuthenticated,
        CidadesController.deleteByIdValidation,
        CidadesController.deleteById
    )
    .put(
        '/cidades/:id',
        ensureAuthenticated,
        CidadesController.updateByIdValidation,
        CidadesController.updateById
    )
    .get(
        '/cidades/:id',
        ensureAuthenticated,
        CidadesController.getByIdValidation,
        CidadesController.getById
    );

export { cidadesRouter };
