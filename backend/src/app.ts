import express from 'express';
import cors from 'cors';
import routes from './Routes';
import ErrorHandler from './Middlewares/ErrorHandler';

const app = express();
app.use(express.json());
app.use(cors());
app.use(routes);
app.use(ErrorHandler.handle);

app.get('/', (_, res) => res.status(200).send('Everything is ok here'));

export default app;
