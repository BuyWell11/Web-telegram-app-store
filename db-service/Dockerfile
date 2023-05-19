FROM node:alpine
WORKDIR /app
EXPOSE 3000
COPY . .
RUN npm install
ENTRYPOINT [ "node" ]
CMD [ "index.js" ]