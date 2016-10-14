from mhart/alpine-node:6
run apk add --update -y make g++ gcc python
add package.json /app/
workdir /app
run npm install
add . /app/
cmd npm run start
