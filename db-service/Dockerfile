FROM node:alpine
WORKDIR /app
EXPOSE 5050
COPY . .
RUN npm install
ENTRYPOINT [ "npm" ]
CMD [ "start" ]