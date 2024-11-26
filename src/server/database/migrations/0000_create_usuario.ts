import type { Knex } from 'knex';
import { ETableNames } from '../ETableNames';

export async function up(knex: Knex) {
    return knex.schema
        .createTable(ETableNames.usuario, (table) => {
            table.bigIncrements('id').primary().index();
            table.string('nomeCompleto').notNullable().checkLength('>=', 3);
            table
                .string('email')
                .unique()
                .index()
                .notNullable()
                .checkLength('>=', 5);
            table.string('senha').notNullable().checkLength('>=', 6);
            table
                .string('role')
                .notNullable()
                .checkIn(['admin', 'collaborator', 'guest']);
            table
                .string('sector')
                .notNullable()
                .checkIn([
                    'digital',
                    'creative',
                    'finance',
                    'customer_service',
                ]);

            table.timestamps(true, true);

            table.comment('Tabela usada para armazenar usuários do sistema');
        })
        .then(() => {
            console.log(`# Created table ${ETableNames.usuario}`);
        });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable(ETableNames.usuario).then(() => {
        console.log(`# Dropped table ${ETableNames.usuario}`);
    });
}
