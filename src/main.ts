import express, {Request, Response, NextFunction} from 'express';
import process from 'node:process';
import root from './routes/root.ts';
import path from 'node:path';
import url from 'node:url';
import createError from 'http-errors';

const PORT = process.env.PORT || 3000;
const app = express();

const dirname = path.dirname(url.fileURLToPath(import.meta.url));
app.set('view engine', 'ejs');
app.set('views', path.join(dirname, '/views'));

app.use('/', root);
app.use(express.static('./public'));

app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404, 'Not Found'));
})

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).send({ errors: [{ message: "Something went wrong" }] });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
