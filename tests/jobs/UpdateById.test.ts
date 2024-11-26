import { StatusCodes } from 'http-status-codes';
import { testServer } from '../jest.setup';
import { IJobCreatePayload, IUsuario } from '../../src/server/database/models';

describe('Jobs - UpdateById', () => {
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
        await testServer.post('/cadastrar').send(usuario);
        const signInRes = await testServer
            .post('/entrar')
            .send({ email: usuario.email, senha: usuario.senha });
        accessToken = signInRes.body.accessToken;
        responsibleId = signInRes.body.usuario.id;
    });

    it('Atualiza registro', async () => {
        const newJob: IJobCreatePayload = {
            nDoc: 'updateById',
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

        const resAtualizada = await testServer
            .put(`/jobs/${res1.body}`)
            .set({ Authorization: `Bearer ${accessToken}` })
            .send({
                ...newJob,
                title: 'Teste de atualização',
            });
        expect(resAtualizada.statusCode).toEqual(StatusCodes.NO_CONTENT);
    });

    it('Tenta atualizar registro que não existe', async () => {
        const newJob: IJobCreatePayload = {
            nDoc: 'updateById2',
            title: 'Teste de criação',
            project: 'Projeto Teste',
            status: 'Em andamento',
            jobSituation: 'Situação teste',
            deadline: new Date(),
            responsibleId: responsibleId ?? 0,
        };
        const res1 = await testServer
            .put('/jobs/99999')
            .set({ Authorization: `Bearer ${accessToken}` })
            .send(newJob);
        expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
        expect(res1.body).toHaveProperty('errors.default');
    });

    it('Tenta atualizar registro não estando autenticado', async () => {
        const newJob: IJobCreatePayload = {
            nDoc: 'updateById3',
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

        const resAtualizada = await testServer.put(`/jobs/${res1.body}`).send({
            ...newJob,
            title: 'Teste de atualização não autenticado',
        });
        expect(resAtualizada.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
        expect(resAtualizada.body).toHaveProperty('errors.default');
    });
});
