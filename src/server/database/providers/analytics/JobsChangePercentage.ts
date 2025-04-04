import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';

interface IJobsChangePercentage {
    changePercentage: number;
    totalJobs: number;
    changeJobs: number;
}

export const jobsChangePercentage = async (
    startDate: string,
    endDate: string,
    responsibleId?: number
): Promise<IJobsChangePercentage | Error> => {
    try {
        // Base query para ambos os casos
        const baseQuery = () => {
            let query = Knex(ETableNames.job)
                .where('timeSheet', '>', 0)
                .whereRaw('updated_at::date BETWEEN ?::date AND ?::date', [
                    startDate,
                    endDate,
                ]);

            if (responsibleId !== undefined) {
                query = query.where('responsibleId', responsibleId);
            }

            return query;
        };

        // Total de jobs completados no período
        const totalJobsResult = await baseQuery().count('* as total').first();

        // Total de jobs que são alterações no período
        const changeJobsResult = await baseQuery()
            .where('isChangeRequest', true)
            .count('* as total')
            .first();

        // Convertendo os resultados
        const totalJobs = Number(totalJobsResult?.total) || 0;
        const changeJobs = Number(changeJobsResult?.total) || 0;

        // Calculando a porcentagem (com proteção contra divisão por zero)
        const changePercentage =
            totalJobs > 0 ? (changeJobs / totalJobs) * 100 : 0;

        return {
            changePercentage,
            totalJobs,
            changeJobs,
        };
    } catch (error) {
        console.error(error);
        return new Error('Erro ao consultar os registros');
    }
};
