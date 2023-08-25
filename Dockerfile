
##### BUILDER
FROM node:19-alpine AS deps

WORKDIR /app

COPY package.json  pnpm-lock.yaml pnpm-lock.yaml\* ./

RUN yarn global add pnpm
RUN pnpm i;

##### BUILDER
FROM node:19-alpine AS proddeps

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-lock.yaml\* ./

RUN yarn global add pnpm
RUN pnpm i -P;




##### BUILDER
FROM node:19-alpine AS builder

ENV DATABASE_URL file:./dev.db

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN yarn global add pnpm
RUN pnpm build


##### RUNNER

FROM --platform=linux/amd64 node:19-alpine AS runner
WORKDIR /app

ENV DATABASE_URL file:./dev.db
ENV NODE_ENV production

#TODO : Make sure docker file has env vars.
ENV HTTPS true
ENV ALLOW_SIGNUP false

# ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=proddeps /app/node_modules ./node_modules
COPY package.json pnpm-lock.yaml\* ./
COPY --from=builder /app/build ./build
COPY dockerEntrypoint.sh /app/dockerEntrypoint.sh

EXPOSE 3000
ENV PORT 3000

RUN chmod +x /app/dockerEntrypoint.sh

ENTRYPOINT ["/app/dockerEntrypoint.sh"]
CMD []