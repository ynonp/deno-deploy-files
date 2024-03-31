import express, {Request, Response, NextFunction} from 'express';
import process from 'node:process';
import root from './routes/root.ts';
import path from 'node:path';
import url from 'node:url';
import buffer from 'node:buffer';
import createError from 'http-errors';
import { contentType } from "https://deno.land/std@0.221.0/media_types/mod.ts";
import { setgroups } from "node:process";

const PORT = process.env.PORT || 3000;
const app = express();

const dirname = path.dirname(url.fileURLToPath(import.meta.url));
app.set('view engine', 'ejs');
app.set('views', path.join(dirname, '/views'));

app.use('/', root);
app.use(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userInput = path.join('./public', req.path);
    const safeInput = path.normalize(userInput).replace(/^(\.\.(\/|\\|$))+/, '');
    const mime = contentType(path.extname(safeInput))
    console.log(`File: ${safeInput}. content type = ${mime}`);
    const content = await Deno.readFile(safeInput);
    res.set('Content-Type', mime);
    res.send(buffer.Buffer.from(content));  
  } catch (err) {
    console.log(`file not found ${req.path}`);
    next();
  }
});

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
