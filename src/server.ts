import dotenv from 'dotenv';
import { App } from './app';

dotenv.config();

const port = parseInt(process.env.PORT || '3001', 10);
const app = new App();

app.listen(port);