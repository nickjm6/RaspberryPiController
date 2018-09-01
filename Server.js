//import necessary dependancies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var portNumber = 8081
var sig = "MyRazPi";
var htmlPath = __dirname + "/frontend/html/"

//set up app in current directory
app.use("/javascript", express.static(__dirname + "/frontend/javascript"));
app.use("/images", express.static(__dirname + "/frontend/images"));
app.use("/css", express.static(__dirname + "/frontend/css"));
app.use("/bootstrap", express.static(__dirname + "/node_modules/bootstrap/dist/css/"))
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function(req, res){
	res.sendFile(htmlPath + "index.html");
});

app.listen(portNumber, function () {
  	console.log("Server started");
});
