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

app.get("/switchOS", function(req, res){
	osName = req.query.toLowerCase()
	if(osName == "kodi" || osName == "retropie" || osName == "raspbian"){
		exec(osName, function(err, stdout, stderr){

		})
	}
	else{
		res.send("Invalid OS")
	}
});

app.get("/update", function(req, res){
	console.log("updating...")
	exec("apt-get update && apt-get upgrade -y", function(err, stdout, stderr){
		if(err)
			console.log(stderr)
		else
			console.log(stdout)
	});
})

app.get("/currentOS", function(req, res){
	res.send("rasplex")
})

app.get("/reboot", function(req, res){
	exec("reboot", function(err, stdout, stderr){
		if(err)
			console.log(stderr)
		else
			console.log(stdout)
	});
})

var server = app.listen(8081, function () {

  var host = server.address().address;
  var port = server.address().port;

  if(host == "::")
  	host = "localhost"

  console.log('Media Server running at http://%s:%s', host, port);

});



