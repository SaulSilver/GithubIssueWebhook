/**
 * Created by hatem on 2016-12-30.
 */
"use strict";

let socket = require('socket.io');

socket.on('receive', function(data) {
   console.log(data);
});