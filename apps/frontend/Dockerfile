FROM node:20

WORKDIR /usr/src/app
COPY . .
RUN corepack enable && corepack prepare pnpm@latest --activate
ENV CI=true
RUN pnpm install --frozen-lockfile

EXPOSE 3000
CMD ["pnpm", "dev"]

