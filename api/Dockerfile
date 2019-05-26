FROM node:10.15.3

RUN mkdir -p /code
WORKDIR /code
COPY ./package.json ./package-lock.json /code/
RUN npm install

COPY . /code/

CMD ["npm", "start"]
