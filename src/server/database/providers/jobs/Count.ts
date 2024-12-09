import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';

export const count = async (
    filter = '',
    completed: boolean
): Promise<number | Error> => {
    try {
        const query = Knex(ETableNames.job).where(
            'title',
            'like',
            `%${filter}%`
        );

        query.andWhere('timeSheet', completed ? '>' : '=', 0);

        const [{ count }] =
            await query.count<[{ count: number }]>('* as count');

        if (Number.isInteger(Number(count))) return Number(count);

        return new Error('Erro ao consultar a quantidade total de registros');
    } catch (error) {
        console.error(error);
        return new Error('Erro ao consultar a quantidade total de registros');
    }
};
