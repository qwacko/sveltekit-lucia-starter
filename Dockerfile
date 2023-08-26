



##### BUILDER
FROM node:19-alpine AS builder


RUN apk add --update --no-cache python3 make g++
RUN ln -sf python3 /usr/bin/python


WORKDIR /app

COPY . .
ENV DATABASE_FILE ./dev.db


RUN yarn global add pnpm
RUN pnpm i;
RUN pnpm build


##### RUNNER

FROM --platform=linux/amd64 node:19-alpine AS runner
WORKDIR /app

RUN apk add --update --no-cache python3 make g++
RUN ln -sf python3 /usr/bin/python


ENV DATABASE_FILE ./dev.db
ENV NODE_ENV production


COPY --from=builder /app/node_modules ./node_modules
COPY package.json pnpm-lock.yaml\* ./
COPY --from=builder /app/.svelte-kit ./build
COPY dockerEntrypoint.sh /app/dockerEntrypoint.sh

EXPOSE 3000
ENV PORT 3000

RUN chmod +x /app/dockerEntrypoint.sh

ENTRYPOINT ["/app/dockerEntrypoint.sh"]
CMD []