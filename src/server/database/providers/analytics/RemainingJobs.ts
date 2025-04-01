import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';

interface IRemainingJobs {
    total: number;
}

export const remainingJobs = async (): Promise<IRemainingJobs | Error> => {
    try {
        const totalQuery = Knex(ETableNames.job)
            .count('* as total')
            .where('timeSheet', '<=', 0);

        const [totalResult] = await totalQuery;

        return {
            total: totalResult.total,
        } as IRemainingJobs;
    } catch (error) {
        console.error(error);
        return new Error('Erro ao consultar os registros');
    }
};
