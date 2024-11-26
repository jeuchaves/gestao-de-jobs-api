import { StatusCodes } from 'http-status-codes';
import { testServer } from '../jest.setup';
import { IJobCreatePayload, IUsuario } from '../../src/server/database/models';

describe('Jobs - GetAll', () => {
    let accessToken = '';
    let responsibleId: number | undefined = undefined;
    beforeAll(async () => {
        const usuario: Omit<IUsuario, 'id' | 'updatedAt' | 'createdAt'> = {
            nomeCompleto: 'Busca registro',
            email: 'busca.registro@gmail.com',
            senha: '123456',
            role: 'admin',
            sector: 'digital',
        };
        await testServer.post('/cadastrar').send(usuario);
        const signInRes = await testServer
            .post('/entrar')
            .send({ email: usuario.email, senha: usuario.senha });
        accessToken = signInRes.body.accessToken;
        responsibleId = signInRes.body.user.id;
    });

    it('Buscar todos os registros', async () => {
        const newJob: IJobCreatePayload = {
            nDoc: '1234567890123456',
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
            .get('/jobs')
            .set({ Authorization: `Bearer ${accessToken}` })
            .send();
        expect(Number(resBuscada.header['x-total-count'])).toBeGreaterThan(0);
        expect(resBuscada.statusCode).toEqual(StatusCodes.OK);
        expect(resBuscada.body.length).toBeGreaterThan(0);
    });

    it('Tenta buscar todos os registros não estando autenticado', async () => {
        const newJob: IJobCreatePayload = {
            nDoc: '12345678901234567',
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

        const resBuscada = await testServer.get('/jobs').send();
        expect(resBuscada.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
        expect(resBuscada.body).toHaveProperty('errors.default');
    });
});
