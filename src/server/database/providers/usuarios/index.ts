import * as getByEmail from './GetByEmail';
import * as create from './Create';
import * as count from './Count';
import * as getAll from './GetAll';

export const UsuariosProvider = {
    ...getByEmail,
    ...create,
    ...count,
    ...getAll,
};
