/**
 * Created by hatem on 2016-12-23.
 */
"use strict";

const express = require('express');

const https = require('https');
const pem = require('pem');

pem.createCertificate({days:1, selfSigned: true}, function (err, keys) {
    const app = express();

    let server = https.createServer({key: keys.serviceKey, cert: keys.certificate}, app).listen(8000);

});

