import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';
import { IJob } from '../../models';

export const create = async (
    job: Omit<IJob, 'id'>
): Promise<number | Error> => {
    try {
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