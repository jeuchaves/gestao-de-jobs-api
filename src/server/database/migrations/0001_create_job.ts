import type { Knex } from 'knex';
import { ETableNames } from '../ETableNames';

export async function up(knex: Knex) {
    return knex.schema
        .createTable(ETableNames.job, (table) => {
            table.bigIncrements('id').primary().index();
            table.string('nDoc').index().notNullable();
            table.string('title').index().notNullable();
            table.string('project').notNullable();
            table.string('status').notNullable();
            table.string('jobSituation');
            table.string('typeDoc').nullable();
            table.date('deadline').notNullable();
            table
                .bigInteger('responsibleId')
                .index()
                .notNullable()
                .references('id')
                .inTable(ETableNames.usuario)
                .onUpdate('CASCADE')
                .onDelete('RESTRICT');

            // Preenchimento posterior a criação da linha

            table
                .string('estimatedComplexity')
                .checkIn(['simple', 'regular', 'complex'])
                .nullable();
            table.boolean('isChangeRequest').defaultTo(false).notNullable();
            table.integer('timeSheet').defaultTo(0).notNullable();
            table
                .string('actualComplexity')
                .checkIn(['simple', 'regular', 'complex'])
                .nullable();
            table.string('contingencies');

            table.timestamps(true, true);

            table.comment('Tabela usada para armazenar jobs no sistema');
        })
        .then(() => {
            console.log(`# Created table ${ETableNames.job}`);
        });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable(ETableNames.job).then(() => {
        console.log(`# Dropped table ${ETableNames.job}`);
    });
}
