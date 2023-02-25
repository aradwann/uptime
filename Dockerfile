###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:18-alpine As development
RUN npm i -g pnpm

WORKDIR /usr/src/app

COPY pnpm-lock.yaml ./

RUN pnpm fetch --prod

COPY . .
RUN pnpm install


###################
# BUILD FOR PRODUCTION
###################

FROM node:18-alpine As build
RUN npm i -g pnpm

WORKDIR /usr/src/app

COPY pnpm-lock.yaml ./

COPY --from=development /usr/src/app/node_modules ./node_modules

COPY . .

RUN pnpm build

ENV NODE_ENV production

RUN pnpm install -r --offline --prod


###################
# PRODUCTION
###################

FROM node:18-alpine As production

COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

CMD [ "node", "dist/main.js" ]
