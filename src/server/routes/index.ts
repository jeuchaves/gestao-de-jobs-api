import { Router } from 'express';
import { jobsRouter } from './jobs.routes';
import { authRouter } from './auth.routes';
import { usuariosRouter } from './usuarios.routes';
import { analyticsRouter } from './analytics.routes';

const router = Router();

router.get('/', (_, res) => {
    return res.send('Olá, DEV!');
});

router.use(jobsRouter);
router.use(authRouter);
router.use(usuariosRouter);
router.use(analyticsRouter);

export { router };
