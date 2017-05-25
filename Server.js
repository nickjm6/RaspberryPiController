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
var piAddress = ""
//var upload = multer();
var count = 1;

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded

app.get("/count", function(req, res){
	res.send(count.toString())
})

app.get("/increment", function(req, res){
	increment()
})

app.get("/resetCount", function(req, res){
	resetCount()
})

app.post("/changeAddress", function(req, res){
	newAddress = req.body.address
	if(newAddress){
		piAddress = newAddress
		res.send("OK")
	}
	else{
		res.status(500).send("not ok")
	}
})

app.get("/piAddress", function(req, res){
	res.send(piAddress)
})

function increment(){
	count++
}

function resetCount(){
	count = 1
}

app.get("/pokemon", function(req, res){
	pokeName = req.query.pokemon
	pokeName = pokeName.replace("+", " ")
	command = "python scripts/pokemon.py scripts/pokemon.txt " + "'" + pokeName + "'"
	result = execSync(command)
	res.send(result)
})

var server = app.listen(80, function () {

  var host = server.address().address;
  var port = server.address().port;

  if(host == "::")
  	host = "localhost"

  console.log('Media Server running at http://%s:%s', host, port);

});


