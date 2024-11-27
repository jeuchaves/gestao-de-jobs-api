import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';
import { IJobCreatePayload } from '../../models';

export const create = async (
    job: IJobCreatePayload
): Promise<number | Error> => {
    try {
        const [{ count }] = await Knex(ETableNames.usuario)
            .where('id', '=', job.responsibleId)
            .count<[{ count: number }]>('* as count');

        if (count === 0) {
            return new Error('O usuário responsável não foi encontrado');
        }

        const [result] = await Knex(ETableNames.job)
            .insert(job)
            .returning('id');
        if (typeof result === 'object') {
            return result.id;
        } else if (typeof result === 'number') {
            return result;
        }
        return new Error('Erro ao cadastrar o registro');
    } catch (error) {
        console.log(error);
        return Error('Erro ao cadastrar o registro');
    }
};
