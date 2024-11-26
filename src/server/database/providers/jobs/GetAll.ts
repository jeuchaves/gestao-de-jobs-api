import { ETableNames } from '../../ETableNames';
import { IJob } from '../../models';
import { Knex } from '../../knex';

export const getAll = async (
    page: number,
    limit: number,
    filter: string
): Promise<IJob[] | Error> => {
    try {
        const result = await Knex(ETableNames.job)
            .select('*')
            .orWhere('title', 'like', `%${filter}%`)
            .offset((page - 1) * limit)
            .limit(limit);

        return result;
    } catch (error) {
        console.log(error);
        return new Error('Erro ao consultar os registros');
    }
};
