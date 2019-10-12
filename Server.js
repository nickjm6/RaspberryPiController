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
	if (result.stderr){
		console.error(result.stderr)
		res.status(500).json({message: "An internal error occured"})
	}
	else{
		res.json({volume: parseInt(result)});
	}
})

app.get("/osAndVolume", function(req, res){
	result = execSync("vol");
	if(result.stderr){
		console.error(result.stderr)
		res.status(400).json({message: "An internal error occured"});
	}
	else{
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
			console.error(result.stderr)
		}
	}
	else{
		res.status(400).json({message: "Invalid OS"})
	}
});

app.post("/reboot", function(req, res){
	res.json({message: "attempting reboot"})
	result = execSync("sudo reboot")
	if(result.stderr){
		console.error(result.stderr)
	}
})

app.post("/rca", function(req, res){
	res.json({message: "Attempting reboot"})
	execSync("rca")
	if(result.stderr){
		console.error(result.stderr)
	}
})

app.post("/hdmi", function(req, res){
	res.json({message: "Attempting reboot"})
	result = execSync("hdmi")
	if(result.stderr){
		console.error(result.stderr)
	}
})

app.post("/volumeup", function(req, res){
	result = execSync("vol +")
	if (result.stderr){
		console.error(result.stderr)
		res.status(500).json({message: "An internal error occured"})
	}
	else{
		res.json({volume: parseInt(result)})
	}
})

app.post("/volumedown", function(req, res){
	result = execSync("vol -")
	if (result.stderr){
		console.error(result.stderr)
		res.status(400).json({message: "An internal error occured"})
	}
	else{
		res.status.json({volume: parseInt(result)})
	}
})


app.listen(config.portNumber, function () {
  	console.log(`Server started at http://localhost:${config.portNumber}`);
});
