/**
 * Created by hatem on 2016-12-30.
 */
"use strict";

let socket = io.connect();

//Notification for issue
socket.on('issue webhook', function (data) {
    console.log('issue');
    //TODO: make the html for the data received, update the existing issues html
    createNotification(data, 'issue');

});

//Create the issue on the page
socket.on('issue body', function(data) {
    renderIssues(data);
});

//Notification for a comment
socket.on('comment webhook', function (data) {
    console.log('notification');
    //TODO: make the html for the data received, update the existing issues html
    createNotification(data, 'comment');
});

//Create the notification html
function createNotification(notification, typeOfAction) {
    let ul = document.getElementById('notification_ul');
    let  li = document.createElement('li');

    li.innerHTML = 'Action: ' + notification.action + ' ' + typeOfAction + '<br/>'
        + 'Title: ' + notification.title + '<br/>'
        + 'User: ' + notification.user + '<br/>';

    ul.appendChild(li);
}

function renderIssues(issue) {
    console.log(issue);
    let ul = document.getElementById('issues_ul');
    let li = document.getElementById(issue.id);

    console.log(issue.id);
    li.innerHTML = 'Title: ' + issue.title  + '<br/>'
        + 'Body: ' + issue.issueBody  + '<br/>'
        + 'Comments: ' + issue.comments + '<br/>'
        + ' URL: ' + issue.issueUrl  + '<br/>'
        + 'Created at: ' + issue.created_at + '<br/>'
        + 'Updated at: ' + issue.updated_at + '<br/>';

    ul.insertBefore(li, ul.firstElementChild);
}