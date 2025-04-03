import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';

interface IRemainingJobs {
    total: number;
}

export const remainingJobs = async (
    responsibleId?: number
): Promise<IRemainingJobs | Error> => {
    try {
        const query = Knex(ETableNames.job).where('timeSheet', '<=', 0);

        // Adiciona o filtro por responsibleId se ele foi fornecido
        if (responsibleId !== undefined) {
            query.where('responsibleId', responsibleId);
        }

        // Executa a query
        const totalQuery = await query.count('* as total').first();

        // Convertendo os resultados
        const totalResult = Number(totalQuery?.total) || 0;

        return {
            total: totalResult,
        } as IRemainingJobs;
    } catch (error) {
        console.error(error);
        return new Error('Erro ao consultar os registros');
    }
};
