import { StatusCodes } from 'http-status-codes';
import { testServer } from '../jest.setup';
import { IJobCreatePayload, IUsuario } from '../../src/server/database/models';

describe('Jobs - GetById', () => {
    let accessToken = '';
    let responsibleId: number | undefined = undefined;
    beforeAll(async () => {
        const usuario: Omit<IUsuario, 'id' | 'updatedAt' | 'createdAt'> = {
            nomeCompleto: 'Busca um registro',
            email: 'busca.um.registro@gmail.com',
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

    it('Busca registro por id', async () => {
        const newJob: IJobCreatePayload = {
            nDoc: 'getById',
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

        const resBuscada = await testServer
            .get(`/jobs/${res1.body}`)
            .set({ Authorization: `Bearer ${accessToken}` })
            .send();
        expect(resBuscada.statusCode).toEqual(StatusCodes.OK);
        expect(resBuscada.body).toHaveProperty('nDoc');
    });

    it('Tenta buscar registro que não existe', async () => {
        const res1 = await testServer
            .get('/jobs/99999')
            .set({ Authorization: `Bearer ${accessToken}` })
            .send();

        expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
        expect(res1.body).toHaveProperty('errors.default');
    });

    it('Tenta buscar registro por id não estando autenticado', async () => {
        const newJob: IJobCreatePayload = {
            nDoc: 'getById2',
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

        const resBuscada = await testServer.get(`/jobs/${res1.body}`).send();
        expect(resBuscada.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
        expect(resBuscada.body).toHaveProperty('errors.default');
    });
});
