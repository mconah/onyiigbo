import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, 'dist');

app.use(express.static(distPath));

app.get('*', (_, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

const port = process.env.PORT || 4173;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
