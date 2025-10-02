import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Copia o arquivo JSON da pasta data para public
const sourceFile = path.join(__dirname, '../data/response-challenge-v2.json');
const destFile = path.join(__dirname, '../public/response-challenge-v2.json');

try {
  fs.copyFileSync(sourceFile, destFile);
        // Arquivo JSON sincronizado
} catch (error) {
  // Erro ao sincronizar arquivo
}
