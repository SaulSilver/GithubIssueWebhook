/**
 * Created by hatem on 2016-12-23.
 */
"use strict";

//For the environment variable
require('dotenv').config();

const express = require('express');
const app = express();

//Tools for express
const bodyParser = require('body-parser');
const path = require('path');
const exphbs = require('express-handlebars');

//Github webhook middleware
const githubMiddleware = require('github-webhook-middleware')({
    secret: process.env.HOOK_KEY        //Secret to check if the received hook is safe
});

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


//Static files
app.use(express.static(path.join(__dirname, 'public')));

//Start listening to the port ----------------------
let server = app.listen(port, () =>
    console.log('Express is up on https://hatemgithub.tk/')
);

// Creating web socket on server side ------------------------
let io = require('socket.io')(server);

//Listening to webhooks
app.post('/hookie', githubMiddleware, function (req, res) {
    res.status(200);
    res.send();

    // action, title, user for the notification
    let notification = {
        action: req.body.action,
        user: req.body.issue.user.login,
        title: req.body.issue.title,
    };

    //triggering off the client to update on receiving from Github
    //Check whether the changed is a comment or an issue
    let xGithubEvent = req.headers['x-github-event'];

    //Object to hold only the required info from the issue
    let context = {
        id: req.body.issue.id,
        title: req.body.issue.title,
        issueBody: req.body.issue.body,
        comments: req.body.issue.comments,
        issueUrl: req.body.issue.url,
        created_at: req.body.issue.created_at,
        updated_at: req.body.issue.updated_at
    };

    if (xGithubEvent === 'issues') {
        io.emit('issue webhook', notification);         //a message with for the notification
        io.emit('issue body', context);         //a message with for the payload

    } else if (xGithubEvent === 'issue_comment') {
        io.emit('comment webhook', notification);
        io.emit('issue body', context);         //a message with for the payload

    }
});
