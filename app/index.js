/* create express instance and listen to port 8080 */
/* DONOT forget (cmd, at project folder): $npm install express -- save */
var express = require('express');
var app = express();
app.use('/', express.static('./public')).listen(8080);
console.log("We have connection! 8080");
