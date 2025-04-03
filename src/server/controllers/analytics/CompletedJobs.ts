import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { AnalyticsProvider } from '../../database/providers';
import { IQueryAnalyticsProps } from './AnalyticsWithComparison';
import { validation } from '../../shared/middleware';
import { number, object, string } from 'yup';

interface ICompletedJobsProps {
    responsibleId?: number;
    startDate?: string;
    endDate?: string;
    startDateComparison?: string;
    endDateComparison?: string;
}

export const completedJobsValidation = validation((getSchema) => ({
    query: getSchema<IQueryAnalyticsProps>(
        object({
            responsibleId: number().optional(),
            startDate: string()
                .required()
                .matches(
                    /^\d{4}-\d{2}-\d{2}$/,
                    'A data de início deve estar no formato YYYY-MM-DD.'
                ),
            endDate: string()
                .required()
                .matches(
                    /^\d{4}-\d{2}-\d{2}$/,
                    'A data final deve estar no formato YYYY-MM-DD.'
                )
                .test(
                    'is-after-start-date',
                    'A data final deve ser posterior à data inicial.',
                    function (value) {
                        const { startDate } = this.parent;
                        return value && startDate
                            ? new Date(value) >= new Date(startDate)
                            : true;
                    }
                ),
            startDateComparison: string()
                .required()
                .matches(
                    /^\d{4}-\d{2}-\d{2}$/,
                    'A data de início da comparação deve estar no formato YYYY-MM-DD.'
                )
                .test(
                    'is-comparison-before-main',
                    'O período de comparação deve terminar antes do início do período principal.',
                    function () {
                        const { startDate, startDateComparison } = this.parent;
                        return startDate && startDateComparison
                            ? new Date(startDateComparison) <
                                  new Date(startDate)
                            : true;
                    }
                ),
            endDateComparison: string()
                .required()
                .matches(
                    /^\d{4}-\d{2}-\d{2}$/,
                    'A data final da comparação deve estar no formato YYYY-MM-DD.'
                )
                .test(
                    'is-after-comparison-start-date',
                    'A data final da comparação deve ser posterior à data inicial da comparação.',
                    function (value) {
                        const { startDateComparison } = this.parent;
                        return value && startDateComparison
                            ? new Date(value) >= new Date(startDateComparison)
                            : true;
                    }
                ),
        })
    ),
}));

export const completedJobs = async (
    req: Request<{}, {}, {}, ICompletedJobsProps>,
    res: Response
) => {
    const {
        startDate,
        endDate,
        startDateComparison,
        endDateComparison,
        responsibleId,
    } = req.query;

    if (!startDate || !endDate || !startDateComparison || !endDateComparison) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ errors: { message: 'Parâmetros inválidos.' } });
    }

    const result = await AnalyticsProvider.completedJobs(
        startDate,
        endDate,
        responsibleId
    );

    const comparisonResult = await AnalyticsProvider.completedJobs(
        startDateComparison,
        endDateComparison,
        responsibleId
    );

    if (result instanceof Error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send(result.message);
    }

    if (comparisonResult instanceof Error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send(comparisonResult.message);
    }

    return res.status(StatusCodes.OK).json({
        total: result.total,
        comparison: comparisonResult.total,
    });
};
