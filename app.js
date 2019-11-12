let config = {}

try {
	config = require("./config")
} catch (err) {
	throw new Error("Environment config is not properly set up, please run the command 'npm run build'")
}

let requiredFields = require("./env.json")
for (let i = 0; i < requiredFields.length; i++) {
	let key = requiredFields[i].name
	if (!config[key]) {
		throw new Error("Config is not set up, please run 'npm run build'")
	}
}

const server = require("./src/server")

const httpServer = require("http").createServer(server)
const io = require("socket.io")(httpServer);
io.on("connection", client => {
	// const SSHClient = require("")
	let ipAddress;
	try{
		ipAddress =  client.handshake.address.match(/(\d{1,3}\.){3}\d{1,3}/)[0]
	} catch (err) {
		ipAddress = "localhost"
	}
	console.log(`A socket connection has been established (${ipAddress})`)
	client.emit("ping", "pong")
	client.on("event", data => {console.log(`${data} (${ipAddress})`)})
})

httpServer.listen(config.port, () => {
	console.log(`Server started at http://localhost:${config.port}`);
});