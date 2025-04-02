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
        const totalQuery = await Knex(ETableNames.job)
            .where('timeSheet', '>', 0)
            .whereRaw('updated_at::date BETWEEN ?::date AND ?::date', [
                startDate,
                endDate,
            ])
            .count('* as total')
            .first();

        const comparisonQuery = await Knex(ETableNames.job)
            .where('timeSheet', '>', 0)
            .whereRaw('updated_at::date BETWEEN ?::date AND ?::date', [
                startDateComparison,
                endDateComparison,
            ])
            .count('* as total')
            .first();

        // Convertendo os resultados
        const completedJobs = Number(totalQuery?.total) || 0;
        const completedJobsComparison = Number(comparisonQuery?.total) || 0;

        return {
            total: completedJobs,
            comparison: completedJobsComparison,
        } as IJobComparison;
    } catch (error) {
        console.error(error);
        return new Error('Erro ao consultar os registros');
    }
};
