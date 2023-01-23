FROM node:19.4.0
WORKDIR /app
COPY . /app
RUN npm install
EXPOSE 3000
CMD [ "node", "server.js" ]