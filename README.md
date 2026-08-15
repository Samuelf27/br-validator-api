<h1 align="center">🔌 br-validator-api</h1>

<p align="center">
API REST em Express para <b>validar e gerar documentos brasileiros</b> — CPF, CNPJ, PIS, CEP e telefone.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white"/>
  <img src="https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white"/>
  <img src="https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white"/>
  <img src="https://img.shields.io/badge/tests-13%20passing-34d399?style=flat"/>
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat"/>
</p>

---

## 📌 Sobre

API HTTP que expõe validação e geração de documentos brasileiros como serviço REST — útil para back-ends, formulários e automações que precisam validar CPF/CNPJ no servidor. Inclui cabeçalhos de segurança com **helmet** e **rate limiting** (100 requisições por minuto por IP via `express-rate-limit`), testes (Supertest), Dockerfile e está pronta para deploy serverless.

## 🔗 Endpoints

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/` | Documentação rápida (JSON) |
| `GET` | `/health` | Status e uptime |
| `GET` | `/:type/validate?value=...` | Valida (`type`: cpf, cnpj, pis, cep, phone) |
| `GET` | `/:type/generate` | Gera um válido (cpf, cnpj, pis) |
| `POST` | `/validate` | Body `{ type, value }` → `{ valid }` |

### Exemplos

```bash
curl https://SEU-DEPLOY/cpf/generate
# { "type": "cpf", "value": "253.863.618-30" }

curl "https://SEU-DEPLOY/cpf/validate?value=529.982.247-25"
# { "type": "cpf", "value": "529.982.247-25", "valid": true }

curl -X POST https://SEU-DEPLOY/validate \
  -H "Content-Type: application/json" \
  -d '{"type":"cnpj","value":"11.222.333/0001-81"}'
# { "type": "cnpj", "value": "11.222.333/0001-81", "valid": true }
```

## 🚀 Como rodar

### Local
```bash
npm install
npm start          # http://localhost:3000
npm test           # testes com Supertest
```

### Docker
```bash
docker build -t br-validator-api .
docker run -p 3000:3000 br-validator-api
```

### Deploy serverless (1 clique)
O projeto já inclui `vercel.json` e a pasta `api/`. Faça o deploy na Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Samuelf27/br-validator-api)

> Também funciona em Render, Railway ou qualquer host Node — o entrypoint é `server.js`.

## 🧱 Arquitetura

```
src/br.js     # lógica de validação/geração (sem dependências)
src/app.js    # app Express (rotas, helmet, rate limiting, CORS, tratamento de erros)
server.js     # entrypoint local
api/index.js  # entrypoint serverless (Vercel)
test/         # testes de integração (Supertest)
```

## 🧪 Testes

**13 testes** de integração com o runner nativo do Node (`node --test`), rodando no CI a cada push e pull request.

Cobrem cada rota e o comportamento de erro da API:

- `GET /:tipo/validate` para CPF, CNPJ, PIS, CEP e telefone
- `GET /cpf/generate` gera um CPF que **passa no próprio `/validate`** — o gerador é verificado contra o validador
- `POST /validate` pelo corpo da requisição
- Tipo inválido → `404`; `type` inválido no corpo → `400`; `value` ausente ou longo demais → `400`
- **JSON malformado responde `400` em JSON, não em HTML** — erro de parse não vaza página de erro do Express

```bash
npm test
```

## 📄 Licença

[MIT](LICENSE) © Samuel Ferreira

---

<p align="center">
  <a href="https://github.com/Samuelf27">GitHub</a> · <a href="https://www.linkedin.com/in/samuel-ferreira27/">LinkedIn</a>
</p>
