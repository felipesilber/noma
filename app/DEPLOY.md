# Deploy (MVP, baixo custo)

Este guia configura:
- Backend (Nest + Prisma) em Fly.io (ou Railway como alternativa)
- Banco Postgres no Neon (free tier)
- Frontend (Expo React Native) usando EXPO_PUBLIC_API_URL

## 1) Banco: Neon Postgres
1. Crie uma conta no Neon e um projeto (Postgres).
2. Habilite Connection Pooling.
3. Copie a `DATABASE_URL` (use `sslmode=require`).
4. Opcional: rode migrações localmente usando:
   ```bash
   cd app/backend
   set DATABASE_URL="postgres://USER:PASS@HOST/db?sslmode=require"
   npx prisma migrate deploy
   ```

## 2) Backend (Nest) – Fly.io
Pré-requisitos: `flyctl` instalado e login feito.

1. No diretório do backend:
   ```bash
   cd app/backend
   flyctl launch --no-deploy
   ```
   - Se perguntado, aceite usar o `Dockerfile`.
   - Edite `fly.toml` se quiser mudar `app` e `primary_region` (padrão: `gru`).
2. Configure secrets:
   ```bash
   flyctl secrets set DATABASE_URL="postgres://USER:PASS@HOST/db?sslmode=require" CORS_ORIGINS="*"
   ```
3. Deploy:
   ```bash
   flyctl deploy
   ```
4. Após deploy, sua API ficará em `https://<app>.fly.dev`.

Notas:
- O `Dockerfile` aplica `prisma migrate deploy` ao iniciar o container.
- O Nest está configurado para escutar em `0.0.0.0` e porta `PORT`.
- Ajuste `CORS_ORIGINS` conforme necessário (separado por vírgula).

### Alternativa: Railway
1. Crie um projeto e conecte o repositório.
2. Variáveis:
   - `PORT` (Railway define automaticamente; o app já lê de `process.env.PORT`)
   - `DATABASE_URL` (Neon)
   - `CORS_ORIGINS` (opcional)
3. Build & Start:
   - Build: `npm ci && npm run build` (padrão)
   - Start: `node dist/main.js`
4. Railway detecta Node e sobe o serviço.

## 3) Frontend (Expo React Native)
1. Defina a URL da API:
   - Crie `app/frontend/.env` com:
     ```
     EXPO_PUBLIC_API_URL=https://<app>.fly.dev
     ```
   - Ou defina no EAS (Project Variables).
2. Rode o app localmente:
   ```bash
   cd app/frontend
   npx expo start
   ```
3. OTA (opcional):
   - Use EAS Updates para publicar mudanças JS sem rebuild nativo.
4. Builds para lojas:
   ```bash
   npx expo prebuild
   npx expo build:android
   npx expo build:ios
   ```

## 4) Checklist rápido
- Neon criado e `DATABASE_URL` copiada (com `sslmode=require`)
- `flyctl launch` executado e `flyctl secrets set` aplicado
- Deploy feito: `flyctl deploy`
- Expo configurado: `EXPO_PUBLIC_API_URL` aponta para a API


