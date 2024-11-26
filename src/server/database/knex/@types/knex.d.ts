import { ICidade, IJob, IUsuario } from '../../models';

declare module 'knex/types/tables' {
    interface Tables {
        cidade: ICidade;
        pessoa: IJob;
        usuario: IUsuario;
    }
}
