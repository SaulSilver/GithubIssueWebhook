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


//Static files
app.use(express.static(path.join(__dirname, 'public')));

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

    //TODO: Think about what kind of data is received (different possibilites)
    //type, action, title, user for the notification

    let xGithubEvent = req.headers['x-github-event'];

    let notification = {
        action: req.body.action,
        user: req.body.issue.user.login,
        title: req.body.issue.title,
    };

    //triggering off the client to update on receiving from Github
    //Check whether the changed is a comment or an issue
    if(xGithubEvent === 'issues') {

        let context = {
                    id: req.body.id,
                    title: req.body.title,
                    issueBody: req.body.body,
                    comments: req.body.comments,
                    issueUrl: req.body.url,
                    created_at: req.body.created_at,
                    updated_at: req.body.updated_at
        };

        io.emit('issue webhook', notification);
        io.emit('issue body', context);
    } else if (xGithubEvent === 'issue_comment') {
        io.emit('comment webhook', notification);
    }

});
