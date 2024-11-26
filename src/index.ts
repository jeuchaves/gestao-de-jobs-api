import 'dotenv/config';
import { Knex } from './server/database/knex';
import { server } from './server/Server';

const startServer = () => {
    server.listen(process.env.PORT || 3333, () => {
        console.log(
            `Server is running on http://localhost:${process.env.PORT || 3333}`
        );
        console.log(
            `Swagger Docs available at http://localhost:${process.env.PORT || 3333}/api-docs`
        );
    });
};

if (process.env.IS_LOCALHOST !== 'true') {
    Knex.migrate
        .latest()
        .then(() => {
            Knex.seed
                .run()
                .then(() => startServer())
                .catch(console.log);
        })
        .catch(console.log);
} else {
    startServer();
}
