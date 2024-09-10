FROM node:20.5.0

WORKDIR /app

COPY .yarn ./.yarn
COPY  .yarnrc.yml package.json yarn.lock* ./
RUN yarn install
COPY . .
EXPOSE 3000
CMD ["yarn", "start", "--host", "0.0.0.0"]