FROM node:10
WORKDIR /usr/app
COPY . .
RUN npm install
RUN npm run build
CMD npx .
