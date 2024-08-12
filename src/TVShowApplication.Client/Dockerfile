FROM node:lts AS development

WORKDIR /src/TVShowApplication.Client
COPY ./src/TVShowApplication.Client/package.json /src/TVShowApplication.Client/package.json
COPY ./src/TVShowApplication.Client/package-lock.json /src/TVShowApplication.Client/package-lock.json

RUN npm ci
COPY . .

ENV CI=true
ENV PORT=3000

CMD [ "npm", "start" ]