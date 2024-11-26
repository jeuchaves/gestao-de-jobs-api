import { Knex } from 'knex';
import { ETableNames } from '../ETableNames';

export const seed = async (knex: Knex) => {
    const [{ count }] = await knex(ETableNames.cidade).count<
        [{ count: number }]
    >('* as count');
    if (!Number.isInteger(count) || Number(count) > 0) return;

    const cidadesToInsert = cidadesDoMatoGrossoDoSul.map((nomeDaCidade) => ({
        nome: nomeDaCidade,
    }));
    await knex(ETableNames.cidade).insert(cidadesToInsert);
};

const cidadesDoMatoGrossoDoSul = [
    'Campo Grande',
    'Dourados',
    'Três Lagoas',
    'Corumbá',
    'Ponta Porã',
    'Naviraí',
    'Nova Andradina',
    'Sidrolândia',
    'Aquidauana',
    'Maracaju',
    'Paranaíba',
    'Amambai',
    'Rio Brilhante',
    'Coxim',
    'Chapadão do Sul',
    'Caarapó',
    'São Gabriel do Oeste',
    'Ivinhema',
    'Aparecida do Taboado',
    'Costa Rica',
    'Miranda',
    'Itaporã',
    'Anastácio',
    'Jardim',
    'Bonito',
    'Ribas do Rio Pardo',
    'Bataguassu',
    'Nova Alvorada do Sul',
    'Bela Vista',
    'Ladário',
    'Cassilândia',
    'Fátima do Sul',
    'Rio Verde de Mato Grosso',
    'Itaquiraí',
    'Mundo Novo',
    'Terenos',
    'Água Clara',
    'Sonora',
    'Coronel Sapucaia',
    'Iguatemi',
    'Deodápolis',
    'Camapuã',
    'Nioaque',
    'Paranhos',
    'Porto Murtinho',
    'Brasilândia',
    'Eldorado',
    'Dois Irmãos do Buriti',
    'Sete Quedas',
    'Tacuru',
    'Aral Moreira',
    'Angélica',
    'Batayporã',
    'Glória de Dourados',
    'Guia Lopes da Laguna',
    'Antônio João',
    'Bodoquena',
    'Inocência',
    'Japorã',
    'Selvíria',
    'Bandeirantes',
    'Anaurilândia',
    'Jaraguari',
    'Santa Rita do Pardo',
    'Pedro Gomes',
    'Laguna Carapã',
    'Juti',
    'Vicentina',
    'Douradina',
    'Paraíso das Águas',
    'Rochedo',
    'Caracol',
    'Rio Negro',
    'Corguinho',
    'Novo Horizonte do Sul',
    'Alcinópolis',
    'Taquarussu',
    'Jateí',
    'Figueirão',
];
