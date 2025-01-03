import { PasswordCrypto } from '../../../shared/services';
import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';
import { IUsuario } from '../../models';

export const updateById = async (
    id: number,
    usuario: Omit<IUsuario, 'id' | 'createdAt' | 'updatedAt'>
): Promise<void | Error> => {
    try {
        const hashedPassword = await PasswordCrypto.hashPassword(usuario.senha);
        const result = await Knex(ETableNames.usuario)
            .update({
                ...usuario,
                senha: hashedPassword,
                updated_at: Knex.fn.now(),
            })
            .where('id', '=', id);
        if (result > 0) return;

        return new Error('Erro ao atualizar o registro');
    } catch (error) {
        console.error(error);
        return new Error('Erro ao atualizar o registro');
    }
};
