/**
 * Created by hatem on 2016-12-30.
 * Client-side; has the socket to communicate with the server side and show info on the browser
 */
"use strict";

let socket = io.connect();

//Notification for issue
socket.on('issue webhook', function (data) {
    createNotification(data, 'issue');
});

//Create the issue on the page
socket.on('issue body', function(data) {
    renderIssues(data);
});

//Notification for a comment
socket.on('comment webhook', function (data) {
    createNotification(data, 'comment');
});

/**
 * Shows the notification
 * @param notification
 * @param typeOfAction
 */
function createNotification(notification, typeOfAction) {
    let ul = document.getElementById('notification_ul');
    let  li = document.createElement('li');
    li.setAttribute('class', 'card-panel');

    li.innerHTML = 'Action: ' + notification.action + ' ' + typeOfAction + '<br/>'
        + 'Title: ' + notification.title + '<br/>'
        + 'User: ' + notification.user + '<br/>';

    ul.appendChild(li);
}

/**
 * Shows the updated issues
 * @param issue
 */
function renderIssues(issue) {
    let ul = document.getElementById('issues_ul');
    let li = document.getElementById(issue.id);

    li.innerHTML = 'Title: ' + issue.title  + '<br/>'
        + 'Body: ' + issue.issueBody  + '<br/>'
        + 'Comments: ' + issue.comments + '<br/>'
        + ' URL: ' + issue.issueUrl  + '<br/>'
        + 'Created at: ' + issue.created_at + '<br/>'
        + 'Updated at: ' + issue.updated_at + '<br/>';

    ul.insertBefore(li, ul.firstElementChild);      //Insert the updated issue on the top of the list
}