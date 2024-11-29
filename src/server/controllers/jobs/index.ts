import * as deleteById from './DeleteById';
import * as updateById from './UpdateById';
import * as getById from './GetById';
import * as create from './Create';
import * as createMany from './CreateMany';
import * as getAll from './GetAll';

export const JobsController = {
    ...deleteById,
    ...updateById,
    ...getById,
    ...create,
    ...createMany,
    ...getAll,
};
