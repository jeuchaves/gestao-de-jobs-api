import { StatusCodes } from 'http-status-codes';
import { testServer } from '../jest.setup';
import { IJobCreatePayload, IUsuario } from '../../src/server/database/models';

describe('Jobs - Create', () => {
    let accessToken = '';
    let responsibleId: number | undefined = undefined;
    beforeAll(async () => {
        const usuario: Omit<IUsuario, 'id' | 'updatedAt' | 'createdAt'> = {
            nomeCompleto: 'Cria registro',
            email: 'cria.registro@gmail.com',
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

    it('Cria registro', async () => {
        const newJob: IJobCreatePayload = {
            nDoc: '123456789',
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
        expect(typeof res1.body).toEqual('number');
    });

    it('Tenta criar registro sem nDoc', async () => {
        const newJobWithoutNDoc: Omit<IJobCreatePayload, 'nDoc'> = {
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
            .send(newJobWithoutNDoc);
        expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(res1.body).toHaveProperty('errors.body.nDoc');
    });

    it('Tenta criar registro com responsibleId inválido', async () => {
        const newJob: IJobCreatePayload = {
            nDoc: '1234567890',
            title: 'Teste de criação',
            project: 'Projeto Teste',
            status: 'Em andamento',
            jobSituation: 'Situação teste',
            deadline: new Date(),
            responsibleId: 9999,
        };
        const res1 = await testServer
            .post('/jobs')
            .set({ Authorization: `Bearer ${accessToken}` })
            .send(newJob);
        expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
        expect(res1.body).toHaveProperty('errors.default');
    });

    it('Tenta criar registro sem nenhuma propriedade', async () => {
        const res1 = await testServer
            .post('/jobs')
            .set({ Authorization: `Bearer ${accessToken}` })
            .send({});
        expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(res1.body).toHaveProperty('errors.body.email');
        expect(res1.body).toHaveProperty('errors.body.cidadeId');
        expect(res1.body).toHaveProperty('errors.body.nomeCompleto');
    });

    it('Tenta criar registro não estando autenticado', async () => {
        const newJob: IJobCreatePayload = {
            nDoc: '12345678901',
            title: 'Teste de criação',
            project: 'Projeto Teste',
            status: 'Em andamento',
            jobSituation: 'Situação teste',
            deadline: new Date(),
            responsibleId: responsibleId ?? 0,
        };
        const res1 = await testServer.post('/jobs').send(newJob);
        expect(res1.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
        expect(res1.body).toHaveProperty('errors.default');
    });
});
