# Backend environment variables

Required:
- PORT: Port the Nest server listens on (default 3000)
- DATABASE_URL: Postgres connection string (Neon recommended). Example:
  - postgres://USER:PASSWORD@HOST:5432/DB?sslmode=require

Optional:
- CORS_ORIGINS: Comma-separated list of allowed origins. If empty, all origins are allowed (reflected).
- NODE_ENV: production | development

Notes:
- Prisma uses `DATABASE_URL`. Migrations are applied on container start via `prisma migrate deploy`.
- Ensure your Neon project has connection pooling enabled. Use the primary connection for migrations and pooled for runtime if needed.


