export type TRoles = 'admin' | 'collaborator' | 'guest';

export type TSectors = 'digital' | 'creative' | 'finance' | 'customer_service';

export interface IUsuario {
    id: number;
    nomeCompleto: string;
    email: string;
    senha: string;
    role: TRoles;
    sector: TSectors;
    createdAt: Date;
    updatedAt: Date;
}
