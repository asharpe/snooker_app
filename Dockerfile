ARG purpose=production

# common
FROM docker-hub.squiz.net/docker/base-images/node:18-alpine as app-base
WORKDIR /app
ENV PORT=80
ENV VIRTUAL_PORT=$PORT
ENV VIRTUAL_PROTO=http

# development
FROM app-base as app-dev
RUN apk add --no-cache bash jq curl

# production build
FROM app-base as app-build
COPY package*.json ./
RUN npm clean-install
COPY . .
RUN node --openssl-legacy-provider node_modules/react-scripts/scripts/build.js

# final image
FROM app-base
COPY --from=app-build /app/build /app/build
RUN npm install -g serve
USER node
ENTRYPOINT ["serve"]
CMD ["-s", "build"]

