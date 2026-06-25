import { test } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import { app } from '../src/app.js';

test('GET /health → ok', async () => {
  const res = await request(app).get('/health');
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.status, 'ok');
});

test('GET /cpf/generate → CPF válido que passa no /validate', async () => {
  const gen = await request(app).get('/cpf/generate');
  assert.strictEqual(gen.status, 200);
  const val = await request(app).get('/cpf/validate').query({ value: gen.body.value });
  assert.strictEqual(val.body.valid, true);
});

test('GET /cpf/validate com valor inválido → valid:false', async () => {
  const res = await request(app).get('/cpf/validate').query({ value: '111.111.111-11' });
  assert.strictEqual(res.body.valid, false);
});

test('GET /cnpj/validate sem value → 400', async () => {
  const res = await request(app).get('/cnpj/validate');
  assert.strictEqual(res.status, 400);
});

test('GET /xpto/validate → 404 (tipo inválido)', async () => {
  const res = await request(app).get('/xpto/validate').query({ value: '1' });
  assert.strictEqual(res.status, 404);
});

test('POST /validate → valida pelo body', async () => {
  const res = await request(app).post('/validate').send({ type: 'cnpj', value: '11.222.333/0001-81' });
  assert.strictEqual(res.body.valid, true);
});
