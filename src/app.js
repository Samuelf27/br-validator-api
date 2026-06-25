import express from 'express';
import { VALIDATORS, GENERATORS } from './br.js';

export const app = express();
app.use(express.json());

// CORS simples (API pública)
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

const TYPES = Object.keys(VALIDATORS);

// Raiz — documentação rápida
app.get('/', (_req, res) => {
  res.json({
    name: 'br-validator-api',
    description: 'API REST para validar e gerar documentos brasileiros.',
    endpoints: {
      'GET /health': 'Status da API',
      'GET /:type/validate?value=...': `Valida um documento (type: ${TYPES.join(', ')})`,
      'GET /:type/generate': 'Gera um documento válido (cpf, cnpj, pis)',
      'POST /validate': 'Body: { type, value } → { valid }',
    },
    author: 'Samuel Ferreira',
  });
});

app.get('/health', (_req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

// Validação via GET
app.get('/:type/validate', (req, res) => {
  const { type } = req.params;
  const { value } = req.query;
  const fn = VALIDATORS[type];
  if (!fn) return res.status(404).json({ error: `Tipo inválido. Use: ${TYPES.join(', ')}` });
  if (value == null) return res.status(400).json({ error: 'Parâmetro "value" é obrigatório.' });
  res.json({ type, value: String(value), valid: fn(value) });
});

// Geração via GET
app.get('/:type/generate', (req, res) => {
  const { type } = req.params;
  const fn = GENERATORS[type];
  if (!fn) return res.status(404).json({ error: `Geração não suportada para "${type}". Use: ${Object.keys(GENERATORS).join(', ')}` });
  res.json({ type, value: fn() });
});

// Validação via POST
app.post('/validate', (req, res) => {
  const { type, value } = req.body || {};
  const fn = VALIDATORS[type];
  if (!fn) return res.status(400).json({ error: `Campo "type" inválido. Use: ${TYPES.join(', ')}` });
  if (value == null) return res.status(400).json({ error: 'Campo "value" é obrigatório.' });
  res.json({ type, value: String(value), valid: fn(value) });
});

// 404
app.use((_req, res) => res.status(404).json({ error: 'Rota não encontrada.' }));
