import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';

interface IJobAverageTime {
    total: number;
}

export const jobsAverageTime = async (
    startDate: string,
    endDate: string
): Promise<IJobAverageTime | Error> => {
    try {
        // Média para o período principal
        const averageTimeSheet = await Knex(ETableNames.job)
            .where('timeSheet', '>', 0)
            .whereRaw('updated_at::date BETWEEN ?::date AND ?::date', [
                startDate,
                endDate,
            ])
            .avg('timeSheet as average_time_sheet')
            .first();

        // Convertendo para número e tratando valores nulos
        const averageTime = Number(averageTimeSheet?.average_time_sheet) || 0;

        return {
            total: averageTime,
        };
    } catch (error) {
        console.error(error);
        return new Error('Erro ao consultar os registros');
    }
};
