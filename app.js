//import necessary dependancies
const express = require('express');
let app = express();
const bodyParser = require('body-parser');


const htmlPath = `${__dirname}/frontend/html`

//set up app in current directory
app.use("/javascript", express.static(__dirname + "/frontend/javascript"));
app.use("/images", express.static(__dirname + "/frontend/images"));
app.use("/css", express.static(__dirname + "/frontend/css"));
app.use("/bootstrap", express.static(__dirname + "/node_modules/bootstrap/dist/css/"))
app.use(bodyParser.json());

let config = {}

try {
	config = require("./config.json")
} catch (err) {
	throw new Error("Environment config is not properly set up, please run the command 'npm run build'")
}

let requiredFields = ["osName", "signature", "port", "otherOperatingSystems"]
for (let i = 0; i < requiredFields.length; i++) {
	let key = requiredFields[i]
	if (!config[key]) {
		throw new Error("Config is not set up, please run 'npm run build'")
	}
}

app.get("/", function (req, res) {
	res.sendFile(`${htmlPath}/index.html`);
});

app.get("/ping", function (req, res) {
	res.json({message: config.signature})
})

app.use("/operatingSystem", require("./src/routes/operatingSystem"))
app.use("/piInfo", require("./src/routes/piInfo"))
app.use("/power", require("./src/routes/power"))
app.use("/volume", require("./src/routes/volume"))


app.listen(config.port, function () {
	console.log(`Server started at http://localhost:${config.port}`);
});
