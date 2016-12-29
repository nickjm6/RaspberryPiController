var express = require('express');
var exec = require("child_process").exec;
var fs = require('fs');
var path = require('path');
var app = express();
var jsonfile = require("jsonfile")
var multer = require('multer');
var bodyParser = require('body-parser');
var sha256 = require("js-sha256")
var execSync = require("child_process").execSync;
//var upload = multer();

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded

app.post("/switchOS", function(req, res){
	osName = req.body.osName
	if(osName == undefined){
		res.send("Please enter a valid OS")
		return
	}
	osName = osName.toLowerCase()
	password = sha256(req.body.password)
	result = execSync("python ../scripts/passCheck.py /home/nickjm6/piPassword.txt " + password).toString()
	result = parseInt(result)
	if(osName == "raspbian" || osName == "retropie" || osName == "rasplex"){
		if(result){
			exec(osName, function(err, stdout, stderr){

			})
			res.send("successful switch")
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
	password = sha256(req.body.password)
	result = execSync("python ../scripts/passCheck.py /home/nickjm6/piPassword.txt " + password).toString()
	result = parseInt(result)
	if(result){
		exec("apt-get update && apt-get upgrade -y", function(err, stdout, stderr){
			if(err)
				console.log(stderr)
			else
				console.log(stdout)
		});
		res.send("update complete!")
	}
	else{
		res.send("incorrect password")
	}
})

app.get("/currentOS", function(req, res){
	res.send("kodi")
})

app.post("/reboot", function(req, res){
	password = sha256(req.body.password)
	result = execSync("python ../scripts/passCheck.py /home/nickjm6/piPassword.txt " + password).toString()
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

var server = app.listen(8081, function () {

  var host = server.address().address;
  var port = server.address().port;

  if(host == "::")
  	host = "localhost"

  console.log('Media Server running at http://%s:%s', host, port);

});



