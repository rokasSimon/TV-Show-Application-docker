FROM node:lts AS development

WORKDIR /src/TVShowApplication.Client
COPY ./src/TVShowApplication.Client/package.json .
COPY ./src/TVShowApplication.Client/package-lock.json .

RUN npm install
COPY ./src/TVShowApplication.Client .

EXPOSE 3000

CMD [ "npm", "start" ]