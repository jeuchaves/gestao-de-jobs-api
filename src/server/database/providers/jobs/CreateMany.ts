import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';
import { IJob, IJobCreatePayload } from '../../models';

export const createMany = async (
    jobs: IJobCreatePayload[]
): Promise<
    { insertedIds: number[]; duplicates: IJobCreatePayload[] } | Error
> => {
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

        // Identificação de jobs duplicados no banco
        const existingJobs = await Knex(ETableNames.job)
            .whereIn(
                'nDoc',
                jobs.map((job) => job.nDoc)
            )
            .andWhere((builder) => {
                builder
                    .whereIn(
                        'title',
                        jobs.map((job) => job.title)
                    )
                    .whereIn(
                        'typeDoc',
                        jobs.map((job) => job.typeDoc || null)
                    );
            })
            .select('*');

        const existingSet = new Set(
            existingJobs.map(
                (job: IJob) => `${job.nDoc}-${job.title}-${job.typeDoc}`
            )
        );

        const uniqueJobs = jobs.filter(
            (job) => !existingSet.has(`${job.nDoc}-${job.title}-${job.typeDoc}`)
        );

        const duplicates = jobs.filter((job) =>
            existingSet.has(`${job.nDoc}-${job.title}-${job.typeDoc}`)
        );

        if (uniqueJobs.length === 0) {
            return { insertedIds: [], duplicates };
        }

        const results = await Knex(ETableNames.job)
            .insert(uniqueJobs)
            .returning('id');

        return {
            insertedIds: results.map((result) =>
                typeof result === 'object' ? result.id : result
            ),
            duplicates,
        };
    } catch (error) {
        console.log(error);
        return Error('Erro ao cadastrar o registro');
    }
};
