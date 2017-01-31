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

//View engine ------------------------
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

//Add supporting for handling HTML form data ------------------------
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Routing ----------------------------------------------------
app.use('/', require('./routes/githubConnect.js'));

//Start listening to the port ----------------------
let server = app.listen(port, () =>
    console.log('Express is up on https://hatemgithub.tk/')
);

// Creating web socket on server side ------------------------
let io = require('socket.io')(server);

//Listening to webhooks
app.post('/hookie', function (req, res) {
    console.log('we are here');
    res.status(200);
    res.send();

    let jsonObj = req['action'];

    console.log(jsonObj);

    //triggering off the client to update on receiving from Github
    io.emit('webhook', 'webhook succeeded: ' + req['action']);
});
