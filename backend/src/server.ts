import express from 'express';

import { Router, Request, Response } from 'express';

import { configDotenv } from 'dotenv';

configDotenv();

const app = express();

const route = Router();

app.use(express.json());

route.get('/', (req: Request, res: Response) => {
  res.json({ message: 'UEBA!' });
});

app.use(route);

const PORT = process.env.BACKEND_PORT || 3001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
