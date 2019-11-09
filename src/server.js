//import necessary dependancies
const express = require('express');
let app = express();
const bodyParser = require('body-parser');

const directory = __dirname.replace("/src", "")
const htmlPath = `${directory}/frontend/html`

//set up app in current directory
app.use("/javascript", express.static(`${directory}/frontend/javascript`));
app.use("/images", express.static(`${directory}/frontend/images`));
app.use("/css", express.static(`${directory}/frontend/css`));
app.use("/bootstrap", express.static(`${directory}/node_modules/bootstrap/dist/css/`))
app.use(bodyParser.json());

let {signature} = require("../config")

app.get("/", function (req, res) {
	res.sendFile(`${htmlPath}/index.html`);
});

app.get("/ping", function (req, res) {
	res.json({message: signature})
})

app.use("/operatingSystem", require("./routes/operatingSystem"))
app.use("/piInfo", require("./routes/piInfo"))
app.use("/power", require("./routes/power"))
app.use("/volume", require("./routes/volume"))


module.exports = app
