import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';

interface IJobComparison {
    total: number;
}

export const completedJobs = async (
    startDate: string,
    endDate: string,
    responsibleId?: number
): Promise<IJobComparison | Error> => {
    try {
        const query = Knex(ETableNames.job)
            .where('timeSheet', '>', 0)
            .whereRaw('updated_at::date BETWEEN ?::date AND ?::date', [
                startDate,
                endDate,
            ])
            .count('* as total');

        // Adiciona o filtro por responsibleId se ele foi fornecido
        if (responsibleId !== undefined) {
            query.where('responsibleId', responsibleId);
        }

        // Executa a query
        const totalQuery = await query.count('* as total').first();

        // Convertendo os resultados
        const completedJobs = Number(totalQuery?.total) || 0;

        return {
            total: completedJobs,
        } as IJobComparison;
    } catch (error) {
        console.error(error);
        return new Error('Erro ao consultar os registros');
    }
};
