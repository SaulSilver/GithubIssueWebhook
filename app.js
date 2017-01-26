/**
 * Created by hatem on 2016-12-23.
 */
"use strict";

const express = require('express');
const app = express();

//Tools for express
const bodyParser = require('body-parser');
const path = require('path');
const exphbs = require('express-handlebars');

const port = process.env.PORT || 8000;

//Static files ------------------------
app.use(express.static(path.join(__dirname, 'public')));

//View engine ------------------------
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

//Add supporting for handling HTML form data ------------------------
app.use(bodyParser.urlencoded({ extended: true }));

//Routing ----------------------------------------------------
app.use('/', require('./routes/githubConnect.js'));

//Start listening to the port ----------------------
let server = app.listen(port, () =>
    console.log('Express is up on http://hatemgithub.tk/')
);

// Creating web socket on server side ------------------------
let io = require('socket.io')(server);

io.on('connection', function(socket) {
    io.emit('connected', 'world');
    console.log('yoooo');
});

app.post('/github', function (req, res) {
    console.log(res);
});
