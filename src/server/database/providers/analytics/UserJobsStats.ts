import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';

interface IUserJobStats {
    userId: number;
    nomeCompleto: string;
    totalCompletedJobs: number;
    totalJobs: number;
}

interface IUserJobsStats {
    users: IUserJobStats[];
    totalJobs: number;
    totalCompletedJobs: number;
}

export const userJobsStats = async (
    startDate: string,
    endDate: string
): Promise<IUserJobsStats | Error> => {
    try {
        // Total de jobs no período
        const totalJobsQuery = await Knex(ETableNames.job)
            .count('id as total')
            .whereBetween('created_at', [startDate, endDate])
            .first();

        const totalJobs = Number(totalJobsQuery?.total) || 0;

        // Total de jobs concluídos no período (timeSheet > 0)
        const totalCompletedJobsQuery = await Knex(ETableNames.job)
            .count('id as total')
            .where('timeSheet', '>', 0)
            .whereBetween('created_at', [startDate, endDate])
            .first();

        const totalCompletedJobs = Number(totalCompletedJobsQuery?.total) || 0;

        // Estatísticas por usuário
        const userStatsQuery = await Knex(ETableNames.usuario)
            .select(
                `${ETableNames.usuario}.id as userId`,
                `${ETableNames.usuario}.nomeCompleto`,
                Knex.raw(
                    `COALESCE(SUM(CASE WHEN ${ETableNames.job}.timeSheet > 0 THEN 1 ELSE 0 END), 0) as totalCompletedJobs`
                ),
                Knex.raw(
                    `COALESCE(COUNT(${ETableNames.job}.id), 0) as totalJobs`
                )
            )
            .leftJoin(
                ETableNames.job,
                `${ETableNames.usuario}.id`,
                `${ETableNames.job}.responsibleId`
            )
            .whereBetween(`${ETableNames.job}.created_at`, [startDate, endDate])
            .groupBy(
                `${ETableNames.usuario}.id`,
                `${ETableNames.usuario}.nomeCompleto`
            );

        const users: IUserJobStats[] = userStatsQuery.map(
            (user: {
                userId: number;
                nomeCompleto: string;
                totalCompletedJobs: number;
                totalJobs: number;
            }) => ({
                userId: user.userId,
                nomeCompleto: user.nomeCompleto,
                totalCompletedJobs: user.totalCompletedJobs,
                totalJobs: user.totalJobs,
            })
        );

        return {
            users,
            totalJobs,
            totalCompletedJobs,
        };
    } catch (error) {
        console.error(error);
        return new Error('Erro ao consultar os registros');
    }
};
