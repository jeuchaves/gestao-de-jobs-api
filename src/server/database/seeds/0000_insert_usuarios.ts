import { Knex } from 'knex';
import { ETableNames } from '../ETableNames';
import { PasswordCrypto } from '../../shared/services';

export const seed = async (knex: Knex) => {
    const [{ count }] = await knex(ETableNames.usuario).count<
        [{ count: number }]
    >('* as count');
    if (!Number.isInteger(count) || Number(count) > 0) return;

    const hashedPassword = await PasswordCrypto.hashPassword('admin');

    const user = {
        nomeCompleto: 'Admin',
        email: 'admin@admin.com',
        senha: hashedPassword,
        role: 'admin',
        sector: 'digital',
    };

    await knex(ETableNames.usuario).insert(user);
};
