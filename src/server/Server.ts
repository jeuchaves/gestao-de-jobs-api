import './shared/services/TranslationsYup';

import swaggerUi from 'swagger-ui-express';
import express from 'express';
import cors from 'cors';

import { router } from './routes';
import swaggerDocs from './shared/services/swagger.json';

const server = express();

server.use(
    cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);

server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

server.use(express.json());

server.use(router);

export { server };
