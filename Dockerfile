FROM node:8.2.0

RUN npm install -g yarn

ENV PORT 80
ENV NODE_ENV production

WORKDIR /var/app
RUN mkdir -p /var/app
ADD package.json /var/app/package.json
RUN yarn

COPY . /var/app

RUN npm run test && npm run build

EXPOSE 80

CMD [ "yarn", "run", "start" ]
