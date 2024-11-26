import { Router } from 'express';

import { ensureAuthenticated } from '../shared/middleware';
import { JobsController } from '../controllers';

const jobsRouter = Router();

jobsRouter
    .get(
        '/jobs',
        ensureAuthenticated,
        JobsController.getAllValidation,
        JobsController.getAll
    )
    .post(
        '/jobs',
        ensureAuthenticated,
        JobsController.createValidation,
        JobsController.create
    );

jobsRouter
    .get(
        '/jobs/:id',
        ensureAuthenticated,
        JobsController.getByIdValidation,
        JobsController.getById
    )
    .put(
        '/jobs/:id',
        ensureAuthenticated,
        JobsController.updateByIdValidation,
        JobsController.updateById
    )
    .delete(
        '/jobs/:id',
        ensureAuthenticated,
        JobsController.deleteByIdValidation,
        JobsController.deleteById
    );

export { jobsRouter };
