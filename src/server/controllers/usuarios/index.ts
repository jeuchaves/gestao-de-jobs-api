import * as signIn from './SignIn';
import * as signUp from './SignUp';
import * as getAll from './GetAll';

export const UsuariosController = {
    ...signIn,
    ...signUp,
    ...getAll,
};
