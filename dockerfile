# ---------- STAGE 1: BUILD ----------
FROM oven/bun:1 AS builder

WORKDIR /app

# Cache de dependências
COPY bun.lock package.json ./
RUN bun install --frozen-lockfile

# Copia código
COPY . .

# Build
RUN bun run build


# ---------- STAGE 2: RUNTIME ----------
FROM oven/bun:1 AS runtime

WORKDIR /app

# Dependência necessária
RUN apt-get update \
 && apt-get install -y python3-cairocffi curl \
 && rm -rf /var/lib/apt/lists/*

# Instala CLI
RUN curl -L https://github.com/leonyu/mysql-visual-explain-cli/releases/latest/download/mysql_visual_explain_cli.pyz \
    -o /usr/local/bin/mysql_visual_explain_cli \
 && chmod +x /usr/local/bin/mysql_visual_explain_cli

# Copia só o necessário
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/bun.lock ./bun.lock

# Garante deps runtime
RUN bun install --frozen-lockfile --production

# USER bun
EXPOSE 3000
ENTRYPOINT ["bun", ".output/server/index.mjs"]
