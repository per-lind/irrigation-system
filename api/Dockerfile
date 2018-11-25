FROM node:10.12.0

RUN mkdir -p /code
WORKDIR /code
COPY ./package.json ./package-lock.json /code/
RUN npm install

COPY . /code/

CMD ["npm", "start"]
