import { ETableNames } from '../../ETableNames';
import { IJob } from '../../models';
import { Knex } from '../../knex';

export const getById = async (id: number): Promise<IJob | Error> => {
    try {
        const result = await Knex(ETableNames.job)
            .select('*')
            .where('id', '=', id)
            .first();

        if (result) return result;

        return new Error('Registro não encontrado');
    } catch (error) {
        console.log(error);
        return new Error('Erro ao consultar o registro');
    }
};
