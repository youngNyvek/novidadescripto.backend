ARG NODE_VERSION=20.12.1

FROM node:${NODE_VERSION}-alpine as base

COPY . /app

WORKDIR /app

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=yarn.lock,target=yarn.lock \
    --mount=type=cache,target=/root/.yarn \
    yarn install --frozen-lockfile

RUN yarn run build

EXPOSE 3001:3001

CMD [ "yarn", "run", "start:dev" ]
