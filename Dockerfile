FROM registry.hub.docker.com/library/node:18-alpine as base

ENV APP_DIR /dedi-web

COPY . ${APP_DIR}
WORKDIR ${APP_DIR}

RUN npm install
RUN npm run build

CMD ["npm", "run", "preview"]