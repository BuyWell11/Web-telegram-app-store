const express = require('express');
const mongoose = require('mongoose');
const AppRouter = require('./app_router')
const UserRouter = require('./user_router');
const SupTicketRouter = require('./supticket_router')
require('dotenv').config({path:__dirname+'/.env'});

const app = express();
const port = 3000;

let bodyParser = require('body-parser');
app.use(bodyParser.json());

mongoose.connect(process.env.URL);

let db = mongoose.connection;


db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log("Database is open");
});


app.listen(port, () => console.log(`App listening on port ${port}!`));

const logger = async (req, res, next) => {
  console.log(req.body);
  next();
}

app.use(logger);

app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use('/user', UserRouter)

app.use('/app', AppRouter)

app.use('/sup', SupTicketRouter)

