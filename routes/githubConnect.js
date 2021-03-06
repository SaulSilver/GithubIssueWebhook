/**
 * Created by hatem on 2017-01-19.
 * Connect to my Github repo and retrieves all the issues and extra features
 */
"use strict";

//For the environment variable
require('dotenv').config();

const router = require('express').Router();
const rp = require('request-promise');

router.route('/')
    .get(function (req, res) {
        let key = process.env.GITHUB_ACCESS_KEY;
        console.log(key);
        let options = {
            uri: 'https://api.github.com/repos/1dv523/hh222ix-examination-3/issues',
            headers: {
                //TODO: add the secret to the environment variable
                'Authorization': 'Basic ' + key,
                'User-Agent': 'Github-Issues-Real-Time-app'
            },
            json: true
        };

        rp(options)
            .then(function(resp) {

                let context = {
                    issues: resp.map(function (issue) {
                        return {
                            id: issue.id,
                            title: issue.title,
                            issueBody: issue.body,
                            comments: issue.comments,
                            issueUrl: issue.url,
                            created_at: issue.created_at,
                            updated_at: issue.updated_at
                        }
                    })
                };

                res.render('home/index.hbs', context);
            })
            .catch(function (err) {
                console.log(err);
            });
    });

module.exports = router;