//import necessary dependancies
var express = require('express');
var execSync = require("child_process").execSync;
var app = express();
var bodyParser = require('body-parser');

//set piAddress to empty string, set portNumber to 80, set count to 1
var piAddress = ""
var portNumber = 80
var count = 1;

//set up app in current directory
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded

//get the count. This is how many times the page had to refresh when searching for Raspberry Pi
app.get("/count", function(req, res){
	res.send(count.toString())
})

//increments the count variable
app.get("/increment", function(req, res){
	increment()
})

//resets the count variable
app.get("/resetCount", function(req, res){
	resetCount()
})

//changes the address to a new address given that the request is valid
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

//gets the piAddress
app.get("/piAddress", function(req, res){
	res.send(piAddress)
})

//increments the count
function increment(){
	count++
}

//resets the count
function resetCount(){
	count = 1
}

//queries a pokemon
app.get("/pokemon", function(req, res){
	pokeName = req.query.pokemon
	pokeName = pokeName.replace("+", " ")
	command = "python scripts/pokemon.py scripts/pokemon.txt " + "'" + pokeName + "'"
	result = execSync(command)
	res.send(result)
})

//sets up server on localhost with port corresponding to portNumber
var server = app.listen(portNumber, function () {
  var port = server.address().port;
  console.log('Media Server running at http://localhost:%s', port);

});


