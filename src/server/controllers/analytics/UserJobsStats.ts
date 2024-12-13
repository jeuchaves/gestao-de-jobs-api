import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { validation } from '../../shared/middleware';
import { object, string } from 'yup';
import { AnalyticsProvider } from '../../database/providers';

interface IQueryProps {
    startDate?: string;
    endDate?: string;
}

export const userJobsStatsValidation = validation((getSchema) => ({
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
        })
    ),
}));

export const userJobsStats = async (
    req: Request<{}, {}, {}, IQueryProps>,
    res: Response
) => {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ errors: { message: 'Parâmetros inválidos.' } });
    }

    const result = await AnalyticsProvider.userJobsStats(startDate, endDate);

    if (result instanceof Error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ errors: { message: 'Erro ao buscar dados.' } });
    }

    return res.status(StatusCodes.OK).json(result);
};
