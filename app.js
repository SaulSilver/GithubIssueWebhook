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
    //TODO: check if the webhook key is applicable

    res.status(200);
    res.send();

    // action, title, user for the notification
    let xGithubEvent = req.headers['x-github-event'];

    let notification = {
        action: req.body.action,
        user: req.body.issue.user.login,
        title: req.body.issue.title,
    };

    //triggering off the client to update on receiving from Github
    //Check whether the changed is a comment or an issue
    if(xGithubEvent === 'issues') {

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
console.log(context);
        io.emit('issue webhook', notification);
        io.emit('issue body', context);
    } else if (xGithubEvent === 'issue_comment') {
        io.emit('comment webhook', notification);
    }

});
