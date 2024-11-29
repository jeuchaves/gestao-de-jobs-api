import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';
import { IUsuario } from '../../models';

export const getAll = async (
    page: number,
    limit: number,
    filter: string
): Promise<IUsuario[] | Error> => {
    try {
        const result = await Knex(ETableNames.usuario)
            .select('*')
            .orWhere('nomeCompleto', 'like', `%${filter}%`)
            .offset((page - 1) * limit)
            .limit(limit);

        return result;
    } catch (error) {
        console.error(error);
        return new Error('Erro ao consultar os registros');
    }
};
