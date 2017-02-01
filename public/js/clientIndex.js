/**
 * Created by hatem on 2016-12-30.
 */
"use strict";

let socket = io.connect();

socket.on('issue webhook', function (data) {
    console.log('issue');
    //TODO: make the html for the data received, update the existing issues html
    createNotification(data, 'issue');

});

socket.on('issue body', function(data) {
    console.log('issue body received');
    renderIssues(data);
});

socket.on('comment webhook', function (data) {
    console.log('notification');
    //TODO: make the html for the data received, update the existing issues html
    createNotification(data, 'comment');
});

//Create the notification html
function createNotification(notification, typeOfAction) {
    let ul = document.getElementById('notification_ul');

    let text = 'Action: ' + notification.action + ' ' + typeOfAction + '<br/>'
        + 'Title: ' + notification.title + '<br/>'
        + 'User: ' + notification.user + '<br/>';

    let  li = document.createElement('li');
    li.innerHTML = text;
    ul.appendChild(li);
}

function renderIssues(issue) {
    let ul = document.getElementById('issues_ul');

    let context = 'Title: ' + issue['title'];

    let  li = document.createElement('li');
    li.innerHTML = context;
    ul.appendChild(li);
}