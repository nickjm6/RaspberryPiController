var express = require('express');
var exec = require("child_process").exec;
var execSync = require("child_process").execSync;
var fs = require('fs');
var path = require('path');
var app = express();
var jsonfile = require("jsonfile")
var multer = require('multer');
var bodyParser = require('body-parser');
var sha256 = require("js-sha256")
//var upload = multer();

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded

app.get("/", function(req, res){
	res.setHeader('Access-Control-Allow-Origin','*');
	res.send("TRUE")
})

app.post("/switchOS", function(req, res){
	res.setHeader('Access-Control-Allow-Origin','*');
	osName = req.body.osName
	if(osName == undefined){
		res.send("Please enter a valid OS")
		return
	}
	osName = osName.toLowerCase()
	password = sha256(req.body.password)
	result = execSync("python passCheck.py piPassword.txt " + password).toString()
	result = parseInt(result)
	if(osName == "kodi" || osName == "retropie" || osName == "raspbian"){
		if(result){
			exec(osName, function(err, stdout, stderr){

			})
			res.send("successful")
		}
		else{
			res.send("incorrect password")
		}
	}
	else{
		res.send("Invalid OS")
	}
});

app.post("/update", function(req, res){
	res.setHeader('Access-Control-Allow-Origin','*');
	password = sha256(req.body.password)
	result = execSync("python passCheck.py piPassword.txt " + password).toString()
	result = parseInt(result)
	if(result){
		exec("apt-get update && apt-get upgrade -y", function(err, stdout, stderr){
			if(err)
				console.log(stderr)
			else
				console.log(stdout)
		});
		res.send("update...")
	}
	else{
		res.send("incorrect password")
	}
})

app.get("/currentOS", function(req, res){
	res.setHeader('Access-Control-Allow-Origin','*');
	res.send("rasplex")
})

app.post("/reboot", function(req, res){
	res.setHeader('Access-Control-Allow-Origin','*');
	password = sha256(req.body.password)
	result = execSync("python passCheck.py piPassword.txt " + password).toString()
	result = parseInt(result)
	if(result){
		exec("reboot", function(err, stdout, stderr){
			if(err)
				console.log(stderr)
			else
				console.log(stdout)
		});
		res.send("successful reboot")
	}
	else{
		res.send("incorrect password")
	}
})

var server = app.listen(9876, function () {

  var host = server.address().address;
  var port = server.address().port;

  if(host == "::")
  	host = "localhost"

  console.log('Media Server running at http://%s:%s', host, port);

});



