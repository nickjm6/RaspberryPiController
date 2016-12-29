var express = require('express');
var exec = require("child_process").exec;
var execSync = require("child_process").execSync;
var fs = require('fs');
var path = require('path');
var app = express();
var jsonfile = require("jsonfile")
var multer = require('multer');
var bodyParser = require('body-parser');
var stringDecoder = require("string_decoder").StringDecoder
var sha256 = require("js-sha256")
//var upload = multer();

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded

app.get("/salute", function(req, res){
	value = req.query
	console.log(value)
	res.send("Hello!")
});

app.post("/passCheck", function(req, res){
	password = sha256(req.body.password)
	result = execSync("python scripts/passCheck.py /home/nickjm6/piPassword.txt " + password)
	res.send(result)
})

app.post("/update", function(req, res){
	console.log(req.body)
})

app.post("/reboot", function(req, res){
	console.log(req.body)
})

app.post("/switchOS", function(req, res){
	console.log(req.body)
})

app.get("/pokemon", function(req, res){
	pokeName = req.query.pokemon
	pokeName = pokeName.replace("+", " ")
	command = "python scripts/pokemon.py scripts/pokemon.txt " + "'" + pokeName + "'"
	result = execSync(command)
	res.send(result)
})

var server = app.listen(9876, function () {

  var host = server.address().address;
  var port = server.address().port;

  if(host == "::")
  	host = "localhost"

  console.log('Media Server running at http://%s:%s', host, port);

});


