import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';

interface IJobComparison {
    total: number;
    comparison: number;
}

export const completedJobs = async (
    startDate: string,
    endDate: string,
    startDateComparison: string,
    endDateComparison: string
): Promise<IJobComparison | Error> => {
    try {
        const totalQuery = Knex(ETableNames.job)
            .count('* as total')
            .where('timeSheet', '>', 0)
            .whereBetween('created_at', [startDate, endDate]);

        const comparisonQuery = Knex(ETableNames.job)
            .count('* as comparison')
            .where('timeSheet', '>', 0)
            .whereBetween('created_at', [
                startDateComparison,
                endDateComparison,
            ]);

        const [totalResult] = await totalQuery;
        const [comparisonResult] = await comparisonQuery;

        return {
            total: totalResult.total,
            comparison: comparisonResult.comparison,
        } as IJobComparison;
    } catch (error) {
        console.error(error);
        return new Error('Erro ao consultar os registros');
    }
};
