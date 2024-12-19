import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';

interface IJobAverageTime {
    averageTime: number;
    comparisonAverageTime: number;
}

export const jobsAverageTime = async (
    startDate: string,
    endDate: string,
    startDateComparison: string,
    endDateComparison: string
): Promise<IJobAverageTime | Error> => {
    try {
        const averageTimeSheet = await Knex(ETableNames.job)
            .where('timeSheet', '>', 0)
            .whereBetween('created_at', [startDate, endDate])
            .avg('timeSheet as average_time_sheet')
            .first();

        const comparisonAverageTimeSheet = await Knex(ETableNames.job)
            .where('timeSheet', '>', 0)
            .whereBetween('created_at', [
                startDateComparison,
                endDateComparison,
            ])
            .avg('timeSheet as comparison_average_time_sheet')
            .first();

        const averageTime = averageTimeSheet?.average_time_sheet ?? 0;
        const comparisonAverageTime =
            comparisonAverageTimeSheet?.comparison_average_time_sheet ?? 0;

        return {
            averageTime,
            comparisonAverageTime,
        };
    } catch (error) {
        console.error(error);
        return new Error('Erro ao consultar os registros');
    }
};
