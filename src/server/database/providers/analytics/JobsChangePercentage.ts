import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';

interface IJobsChangePercentage {
    changePercentage: number;
    comparisonChangePercentage: number;
}

export const jobsChangePercentage = async (
    startDate: string,
    endDate: string,
    startDateComparison: string,
    endDateComparison: string
): Promise<IJobsChangePercentage | Error> => {
    try {
        // Total de jobs no período principal
        const totalJobs = await Knex(ETableNames.job)
            .whereBetween('created_at', [startDate, endDate])
            .count('* as total')
            .first();

        // Total de jobs que são alterações no período principal
        const changeJobs = await Knex(ETableNames.job)
            .whereBetween('created_at', [startDate, endDate])
            .andWhere('isChangeRequest', true)
            .count('* as total')
            .first();

        // Total de jobs no período de comparação
        const comparisonTotalJobs = await Knex(ETableNames.job)
            .whereBetween('created_at', [
                startDateComparison,
                endDateComparison,
            ])
            .count('* as total')
            .first();

        // Total de jobs que são alterações no período de comparação
        const comparisonChangeJobs = await Knex(ETableNames.job)
            .whereBetween('created_at', [
                startDateComparison,
                endDateComparison,
            ])
            .andWhere('isChangeRequest', true)
            .count('* as total')
            .first();

        // Extrai os valores e calcula a porcentagem
        const total = Number(totalJobs?.total) || 0;
        const changes = Number(changeJobs?.total) || 0;
        const comparisonTotal = Number(comparisonTotalJobs?.total) || 0;
        const comparisonChanges = Number(comparisonChangeJobs?.total) || 0;

        const changePercentage = total > 0 ? (changes / total) * 100 : 0;
        const comparisonChangePercentage =
            comparisonTotal > 0
                ? (comparisonChanges / comparisonTotal) * 100
                : 0;

        return {
            changePercentage,
            comparisonChangePercentage,
        };
    } catch (error) {
        console.error(error);
        return new Error('Erro ao consultar os registros');
    }
};
