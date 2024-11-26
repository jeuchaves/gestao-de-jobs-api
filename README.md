# API REST NODE E TYPESCRIPT

Este repositório contém uma API REST básica construída com Node.js e TypeScript, incluindo autenticação, migrações e seeds utilizando o ORM Knex.

## Como rodar a aplicação

1. Instale as dependências:
    ```sh
    npm install
    ```

2. Clone o arquivo `.env.example` para `.env`:
    ```sh
    cp .env.example .env
    ```

3. Configure as variáveis de ambiente no arquivo `.env` com os dados reais.

4. Execute o seguinte comando no terminal para iniciar a aplicação:
    ```sh
    npm run start
    ```

Sua aplicação estará rodando em [http://localhost:3333](http://localhost:3333).

## Executar testes

Para rodar os testes, utilize o comando:
```sh
npm test
```

## Executar migrações e seeds

### Rollback de todas as migrações
```sh
npm run knex:rollback-all
```

### Rollback da última migração
```sh
npm run knex:rollback
```

### Executar migrações
```sh
npm run knex:migrate
```

### Executar seeds
```sh
npm run knex:seed
```

## Criar build

Para criar uma build da aplicação, execute:
```sh
npm run build
```

Após isso, a pasta `build` será criada. Para iniciar a aplicação em modo de produção, execute:
```sh
npm run production
```