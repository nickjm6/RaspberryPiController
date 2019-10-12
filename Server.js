//import necessary dependancies
const express = require('express');
let app = express();
const bodyParser = require('body-parser');

const htmlPath = __dirname + "/frontend/html/"

require("dotenv").config()

//set up app in current directory
app.use("/javascript", express.static(__dirname + "/frontend/javascript"));
app.use("/images", express.static(__dirname + "/frontend/images"));
app.use("/css", express.static(__dirname + "/frontend/css"));
app.use("/bootstrap", express.static(__dirname + "/node_modules/bootstrap/dist/css/"))
app.use(bodyParser.json());

const config = {
	osName: process.env.OSNAME,
	portNumber: process.env.PORT,
	signature: process.env.SIGNATURE
}

const validOSList = ["raspbian", "retropie"]

let keys = Object.keys(config)
for(let i = 0; i < keys.length; i++){
	let key = keys[i]
	if(!keys[key]){
		throw new Error("Config is not set up, please run 'npm run build'")
	}
}

app.get("/", function(req, res){
	res.sendFile(htmlPath + "index.html");
});

app.get("/ping", function(req, res){
		res.json({message: config.signature})
})

app.get("/currentOS", function(req, res){
	res.json({currentOS: config.osName})
});

app.get("/getVol", function(req, res){
	result = execSync("vol")
	if (result.stderr)
		res.status(400).json({message: result.stderr, volume: 0})
	else
		res.json({volume: parseInt(result)});
})

app.get("/osAndVolume", function(req, res){
	result = execSync("vol");
	if(result.stderr)
		res.status(400).json({message: result.stderr, volume: 0});
	else{
		intVol = parseInt(result);
		res.json({volume: parseInt(result), currentOS: config.osName});
	}
})

app.post("/switchOS", function(req, res){
	let osName = req.body.osName
	console.log(`attempting to switch to: ${osName}`)
	if(osName === undefined){
		res.status(400).json({message: "Please enter a valid OS"});
		return;
	}
	osName = osName.toLowerCase()
	const otherOSList = validOSList.filter(os => os != config.osName)
	if(otherOSList.includes(osName)){
		res.json({message: "Attempting to switchOS"})
		result = execSync(osName)
		if(result.stderr){
			console.log(result.stderr)
		}
	}
	else{
		res.status(400).json({message: "Invalid OS"})
	}
});

//reboots the raspberry pi
app.post("/reboot", function(req, res){
	res.setHeader('Access-Control-Allow-Origin','*');
	if(req.body.test != undefined){
		res.json({message: "success"})
		return;
	}
	res.json({message: "attempting reboot"})
	result = execSync("sudo reboot")
	if(result.stderr){
		console.log(result.stderr)
	}
})

//changes the output mode to rca, which will display onto the touchscreen
app.post("/rca", function(req, res){
	res.setHeader('Access-Control-Allow-Origin','*');
	if(req.body.test != undefined){
		res.json({message: "success"})
		return;
	}
	res.json({message: "Attempting reboot"})
	execSync("rca")
	if(result.stderr){
		console.log(result.stderr)
	}
})

//sets the output mode to HDMI
app.post("/hdmi", function(req, res){
	res.setHeader('Access-Control-Allow-Origin','*');
	if(req.body.test != undefined){
		res.json({message: "success"})
		return;
	}
	res.json({message: "Attempting reboot"})
	result = execSync("hdmi")
	if(result.stderr){
		console.log(result.stderr)
	}
})

//Turns the volume up on the pi
app.post("/volumeup", function(req, res){
	res.setHeader("Access-Control-Allow-Orgin", "*")
	result = execSync("vol +")
	if (result.stderr)
		res.status(400).json({message: result.stderr, volume: 0})
	else
		res.status(200).json({message: "success", volume: parseInt(result)})
})

//turns the volume down on the pi
app.post("/volumedown", function(req, res){
	res.setHeader("Access-Control-Allow-Orgin", "*")
	result = execSync("vol -")
	if (result.stderr)
		res.status(400).json({message: result.stderr, volume: 0})
	else
		res.status(200).json({message: "success", volume: parseInt(result)})
})

//This puts up the server on localhost on the port specified by portNumber
var server = app.listen(portNumber, function () {
  var port = server.address().port;
  console.log('Media Server running at http://localhost:%s', port);
});

app.listen(portNumber, function () {
  	console.log("Server started");
});
