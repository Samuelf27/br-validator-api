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

test('GET /pis/validate → valida PIS', async () => {
  const gen = await request(app).get('/pis/generate');
  assert.strictEqual(gen.status, 200);
  const val = await request(app).get('/pis/validate').query({ value: gen.body.value });
  assert.strictEqual(val.status, 200);
  assert.strictEqual(val.body.valid, true);
});

test('GET /cep/validate → valida CEP', async () => {
  const ok = await request(app).get('/cep/validate').query({ value: '01001-000' });
  assert.strictEqual(ok.status, 200);
  assert.strictEqual(ok.body.valid, true);
  const bad = await request(app).get('/cep/validate').query({ value: '123' });
  assert.strictEqual(bad.body.valid, false);
});

test('GET /phone/validate → valida telefone', async () => {
  const ok = await request(app).get('/phone/validate').query({ value: '(11) 91234-5678' });
  assert.strictEqual(ok.status, 200);
  assert.strictEqual(ok.body.valid, true);
  const bad = await request(app).get('/phone/validate').query({ value: '(00) 1234-5678' });
  assert.strictEqual(bad.body.valid, false);
});

test('POST /validate com type inválido → 400', async () => {
  const res = await request(app).post('/validate').send({ type: 'xpto', value: '123' });
  assert.strictEqual(res.status, 400);
  assert.ok(res.body.error);
});

test('POST /validate sem value → 400', async () => {
  const res = await request(app).post('/validate').send({ type: 'cpf' });
  assert.strictEqual(res.status, 400);
  assert.ok(res.body.error);
});

test('POST /validate com value muito longo → 400', async () => {
  const res = await request(app).post('/validate').send({ type: 'cpf', value: '1'.repeat(101) });
  assert.strictEqual(res.status, 400);
  assert.ok(res.body.error);
});

test('POST /validate com JSON malformado → 400 em JSON (não HTML)', async () => {
  const res = await request(app)
    .post('/validate')
    .set('Content-Type', 'application/json')
    .send('{ "type": "cpf", ');
  assert.strictEqual(res.status, 400);
  assert.match(res.headers['content-type'], /application\/json/);
  assert.ok(res.body.error);
});
