import { Router } from 'express';
import { pessoasRouter } from './pessoas.routes';
import { cidadesRouter } from './cidades.routes';
import { usuariosRouter } from './usuarios.routes';

const router = Router();

router.get('/', (_, res) => {
    return res.send('Olá, DEV!');
});

/**
 * @swagger
 * tags:
 *   - name: Cidades
 *     description: Operações relacionadas a cidades
 *   - name: Pessoas
 *     description: Operações relacionadas a pessoas
 *   - name: Usuários
 *     description: Operações relacionadas a usuários
 */

router.use(pessoasRouter);
router.use(cidadesRouter);
router.use(usuariosRouter);

export { router };
