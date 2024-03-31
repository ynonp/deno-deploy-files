import express from 'express';
import process from 'node:process';
import root from './routes/root.ts';
import path from 'node:path';
import url from 'node:url';

const PORT = process.env.PORT || 3000;
const app = express();

const dirname = path.dirname(url.fileURLToPath(import.meta.url));
app.set('view engine', 'ejs');
app.set('views', path.join(dirname, '/views'));

app.use('/', root);
app.use(express.static('./public'));
app.set()

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
