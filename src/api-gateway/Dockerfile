FROM node:12-alpine

WORKDIR /app

COPY package.json package.json

RUN yarn install --production=false --pure-lockfile --non-interactive --cache-folder ./ycache; rm -rf ./ycache

COPY . .

EXPOSE 3000

CMD [ "yarn", "start" ]