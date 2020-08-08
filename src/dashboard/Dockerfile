FROM node:12-alpine as build-stage
WORKDIR /app

COPY package.json package.json
RUN yarn
COPY . .
RUN yarn build

FROM nginx:1.17-perl
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build-stage /app/index.html /usr/share/nginx/html/index.html
COPY --from=build-stage /app/dist       /usr/share/nginx/html/dist

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
