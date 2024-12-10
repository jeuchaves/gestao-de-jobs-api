import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { object, string } from 'yup';

import { validation } from '../../shared/middleware';
import { AnalyticsProvider } from '../../database/providers';

interface IQueryProps {
    startDate?: string;
    endDate?: string;
    startDateComparison?: string;
    endDateComparison?: string;
}

export const jobsComparisonValidation = validation((getSchema) => ({
    query: getSchema<IQueryProps>(
        object({
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

export const jobsComparison = async (
    req: Request<{}, {}, {}, IQueryProps>,
    res: Response
) => {
    const { startDate, endDate, startDateComparison, endDateComparison } =
        req.query;

    if (!startDate || !endDate || !startDateComparison || !endDateComparison) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ errors: { message: 'Parâmetros inválidos.' } });
    }

    return res.status(StatusCodes.OK).json({
        total: 100,
        comparison: 50,
    });
};
