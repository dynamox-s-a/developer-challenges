import express from 'express'
import cors from 'cors';

import routes from './routes/routes';
import db from './db/db';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded())

app.use(routes);

//@ts-ignore
db.sync(() => console.log(`Banco de dados conectado: ${process.env.DB_NAME}`));

app.listen(3333, () => 'server running on port 3333')
