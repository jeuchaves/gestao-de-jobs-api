import * as signIn from './SignIn';
import * as signUp from './SignUp';
import * as getAll from './GetAll';
import * as updateById from './UpdateById';

export const UsuariosController = {
    ...signIn,
    ...signUp,
    ...getAll,
    ...updateById,
};
