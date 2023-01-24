FROM node:19.4.0
WORKDIR /app
COPY . /app
RUN npm install
EXPOSE 8080
CMD [ "node", "app.js" ]
