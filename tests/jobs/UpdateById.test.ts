import { StatusCodes } from 'http-status-codes';
import { testServer } from '../jest.setup';
import { IUsuario } from '../../src/server/database/models';

describe('Jobs - UpdateById', () => {
    let accessToken = '';
    beforeAll(async () => {
        const usuario: Omit<IUsuario, 'id'> = {
            nomeCompleto: 'Atualizar registro',
            email: 'atualiza.registro@gmail.com',
            senha: '123456',
            role: 'admin',
            sector: 'digital',
        };
        await testServer.post('/cadastrar').send(usuario);
        const signInRes = await testServer
            .post('/entrar')
            .send({ email: usuario.email, senha: usuario.senha });
        accessToken = signInRes.body.accessToken;
    });

    it('Atualiza registro', async () => {
        const res1 = await testServer
            .post('/jobs')
            .set({ Authorization: `Bearer ${accessToken}` })
            .send({
                nomeCompleto: 'João Carlos',
                email: 'joao.carlos.updateById@gmail.com',
                cidadeId,
            });
        expect(res1.statusCode).toEqual(StatusCodes.CREATED);

        const resAtualizada = await testServer
            .put(`/jobs/${res1.body}`)
            .set({ Authorization: `Bearer ${accessToken}` })
            .send({
                nomeCompleto: 'João Carlos Updated',
                email: 'joao.carlos.updateById@gmail.com',
                cidadeId,
            });
        expect(resAtualizada.statusCode).toEqual(StatusCodes.NO_CONTENT);
    });

    it('Tenta atualizar registro que não existe', async () => {
        const res1 = await testServer
            .put('/jobs/99999')
            .set({ Authorization: `Bearer ${accessToken}` })
            .send({
                nomeCompleto: 'Caxias',
                cidadeId,
                email: 'joao.carlos@gmail.com',
            });
        expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
        expect(res1.body).toHaveProperty('errors.default');
    });

    it('Tenta atualizar registro não estando autenticado', async () => {
        const res1 = await testServer
            .post('/jobs')
            .set({ Authorization: `Bearer ${accessToken}` })
            .send({
                nomeCompleto: 'João Carlos',
                email: 'joao.carlos.updateByIdNotAuthenticated@gmail.com',
                cidadeId,
            });
        expect(res1.statusCode).toEqual(StatusCodes.CREATED);

        const resAtualizada = await testServer.put(`/jobs/${res1.body}`).send({
            nomeCompleto: 'João Carlos Updated',
            email: 'joao.carlos.updateByIdNotAuthenticated@gmail.com',
            cidadeId,
        });
        expect(resAtualizada.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
        expect(resAtualizada.body).toHaveProperty('errors.default');
    });
});
