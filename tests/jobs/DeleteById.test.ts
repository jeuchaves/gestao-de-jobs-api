import { StatusCodes } from 'http-status-codes';
import { testServer } from '../jest.setup';
import { IJobCreatePayload, IUsuario } from '../../src/server/database/models';

describe('Jobs - DeleteById', () => {
    let accessToken = '';
    let responsibleId: number | undefined = undefined;
    beforeAll(async () => {
        const usuario: Omit<IUsuario, 'id' | 'updatedAt' | 'createdAt'> = {
            nomeCompleto: 'Deleta registro',
            email: 'deleta.registro@gmail.com',
            senha: '123456',
            role: 'admin',
            sector: 'digital',
        };
        await testServer.post('/auth/signup').send(usuario);
        const signInRes = await testServer
            .post('/auth/login')
            .send({ email: usuario.email, senha: usuario.senha });
        accessToken = signInRes.body.accessToken;
        responsibleId = signInRes.body.usuario.id;
    });

    it('Apaga registro', async () => {
        const newJob: IJobCreatePayload = {
            nDoc: '123456789012',
            title: 'Teste de criação',
            project: 'Projeto Teste',
            status: 'Em andamento',
            jobSituation: 'Situação teste',
            deadline: new Date(),
            responsibleId: responsibleId ?? 0,
        };
        const res1 = await testServer
            .post('/jobs')
            .set({ Authorization: `Bearer ${accessToken}` })
            .send(newJob);
        expect(res1.statusCode).toEqual(StatusCodes.CREATED);

        const resApagada = await testServer
            .delete(`/jobs/${res1.body}`)
            .set({ Authorization: `Bearer ${accessToken}` })
            .send();
        expect(resApagada.statusCode).toEqual(StatusCodes.NO_CONTENT);
    });

    it('Tenta apagar registro que não existe', async () => {
        const res1 = await testServer
            .delete('/jobs/99999')
            .set({ Authorization: `Bearer ${accessToken}` })
            .send();

        expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
        expect(res1.body).toHaveProperty('errors.default');
    });

    it('Tenta apagar registro não estando autenticado', async () => {
        const newJob: IJobCreatePayload = {
            nDoc: '1234567890123',
            title: 'Teste de criação',
            project: 'Projeto Teste',
            status: 'Em andamento',
            jobSituation: 'Situação teste',
            deadline: new Date(),
            responsibleId: responsibleId ?? 0,
        };
        const res1 = await testServer
            .post('/jobs')
            .set({ Authorization: `Bearer ${accessToken}` })
            .send(newJob);
        expect(res1.statusCode).toEqual(StatusCodes.CREATED);

        const resApagada = await testServer.delete(`/jobs/${res1.body}`).send();
        expect(resApagada.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
        expect(resApagada.body).toHaveProperty('errors.default');
    });
});
