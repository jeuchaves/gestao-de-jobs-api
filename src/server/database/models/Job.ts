export type TComplexity = 'simple' | 'regular' | 'complex';

export interface IJob {
    id: number;
    nDoc: string;
    title: string;
    project: string;
    status: string;
    jobSituation?: string;
    deadline: Date;
    responsibleId: number;
    estimatedComplexity?: TComplexity;
    isChangeRequest: boolean;
    timeSheet: number;
    actualComplexity?: TComplexity;
    contingencies?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IJobCreatePayload
    extends Pick<
        IJob,
        | 'nDoc'
        | 'title'
        | 'project'
        | 'status'
        | 'jobSituation'
        | 'deadline'
        | 'responsibleId'
    > {}
