var express = require('express');
var exec = require("child_process").exec;
var fs = require('fs');
var path = require('path');
var app = express();
var jsonfile = require("jsonfile")
var multer = require('multer');
var bodyParser = require('body-parser');
//var upload = multer();

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded

var server = app.listen(8081, function () {

  var host = server.address().address;
  var port = server.address().port;

  if(host == "::")
  	host = "localhost"

  console.log('Media Server running at http://%s:%s', host, port);

});



