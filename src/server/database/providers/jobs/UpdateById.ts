import { ETableNames } from '../../ETableNames';
import { IJob } from '../../models';
import { Knex } from '../../knex';

export const updateById = async (
    id: number,
    job: Partial<Omit<IJob, 'id'>>
): Promise<void | Error> => {
    try {
        const result = await Knex(ETableNames.job)
            .update(job)
            .where('id', '=', id);

        if (result > 0) return;

        return new Error('Erro ao atualizar o registro');
    } catch (error) {
        console.log(error);
        return new Error('Erro ao atualizar o registro');
    }
};
