import { ETableNames } from '../../ETableNames';
import { IJob } from '../../models';
import { Knex } from '../../knex';

export const getAll = async (
    page: number,
    limit: number,
    filter: string,
    completed: boolean,
    userId?: number
): Promise<IJob[] | Error> => {
    try {
        const query = Knex(ETableNames.job)
            .select(
                `${ETableNames.job}.*`,
                `${ETableNames.usuario}.nomeCompleto as responsibleName`
            )
            .join(
                ETableNames.usuario,
                `${ETableNames.job}.responsibleId`,
                `${ETableNames.usuario}.id`
            )
            .where(`${ETableNames.job}.title`, 'like', `%${filter}%`)
            .orderBy(`${ETableNames.job}.deadline`, 'asc')
            .offset((page - 1) * limit)
            .limit(limit);

        query.andWhere(
            `${ETableNames.job}.timeSheet`,
            completed ? '>' : '=',
            0
        );

        if (userId) {
            query.andWhere(`${ETableNames.job}.responsibleId`, '=', userId);
        }

        const result = await query;

        return result;
    } catch (error) {
        console.error(error);
        return new Error('Erro ao consultar os registros');
    }
};
