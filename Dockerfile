FROM node:20.5.0

WORKDIR /app

RUN corepack enable && corepack prepare yarn@3.8.5

COPY  .yarnrc.yml package.json yarn.lock* ./

RUN yarn install
COPY . .
EXPOSE 3000
CMD ["yarn", "start", "--host", "0.0.0.0"]