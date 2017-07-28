FROM node:8.2.0

RUN npm install -g yarn

ENV PORT 80
ENV NODE_ENV production

WORKDIR /var/app
RUN mkdir -p /var/app
COPY . /var/app
RUN yarn

RUN npm run test && npm run build

EXPOSE 80

CMD [ "yarn", "run", "start" ]
