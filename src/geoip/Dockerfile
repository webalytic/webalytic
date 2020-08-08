FROM node:12.18.3 as builder

WORKDIR /app
COPY package.json package.json
RUN yarn install --production=false --pure-lockfile --non-interactive --cache-folder ./ycache; rm -rf ./ycache
COPY . .
RUN yarn build

FROM node:12.18.3-slim as app

WORKDIR /app

COPY . .

COPY --from=builder /app/node_modules node_modules
COPY --from=builder /app/shared shared

EXPOSE 50051

CMD [ "yarn", "start" ]
