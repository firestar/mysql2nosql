FROM node as build-step
COPY . /srv/
WORKDIR /srv/
RUN yarn install
RUN npm run build

FROM nginx:1.17.1-alpine
COPY --from=build-step /srv/build /usr/share/nginx/html
