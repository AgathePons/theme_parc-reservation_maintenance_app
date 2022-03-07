const express = require('express');
const router = require('./router');

const app = express();

app.set('view engine', 'pug');
app.set('views', './app/views');
app.use(express.static('./public'));

app.use(express.json());

app.use(router);

module.exports = app;
