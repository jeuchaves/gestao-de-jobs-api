import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';
import { IJobCreatePayload } from '../../models';

export const createMany = async (
    jobs: IJobCreatePayload[]
): Promise<number[] | Error> => {
    try {
        const responsibleIds = [
            ...new Set(jobs.map((job) => job.responsibleId)),
        ];

        const validResponsibleIds = await Knex(ETableNames.usuario)
            .whereIn('id', responsibleIds)
            .select('id');

        const validInSet = new Set(validResponsibleIds.map((user) => user.id));

        const invalidJobs = jobs.filter(
            (job) => !validInSet.has(Number(job.responsibleId))
        );

        if (invalidJobs.length > 0) {
            const invalidIds = [
                ...new Set(invalidJobs.map((job) => job.responsibleId)),
            ];
            return new Error(
                `Os seguintes IDs de responsáveis não foram encontrados: ${invalidIds.join(', ')}`
            );
        }

        const results = await Knex(ETableNames.job)
            .insert(jobs)
            .returning('id');

        return results.map((result) =>
            typeof result === 'object' ? result.id : result
        );
    } catch (error) {
        console.log(error);
        return Error('Erro ao cadastrar o registro');
    }
};
