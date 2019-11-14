let config = {}
const stripAnsi = require("strip-ansi")


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
const SSHClient = require("ssh2").Client
const httpServer = require("http").createServer(server)
const io = require("socket.io")(httpServer);
io.on("connection", client => {
	let ipAddress;
	try{
		ipAddress =  client.handshake.address.match(/(\d{1,3}\.){3}\d{1,3}/)[0]
	} catch (err) {
		ipAddress = "localhost"
	}
	console.log(`A socket connection has been established (${ipAddress})`)
	let conn = new SSHClient()
	conn.on("ready", () => {
		console.log(`Client is connected to ssh terminal (${ipAddress})`)
		conn.shell((err, stream) => {
			client.emit("data", "You have successfully connect via ssh")
			if(err){
				client.emit("data", err.message)
			}

			client.on("command", command => {
				try{
					console.log(`COMMAND: ${command} (${ipAddress})`)
					stream.write(`${command}\n`)
				}catch(err){
					client.emit("data", "failed to write to console, maybe you have disconnected?")
				}
			})

			stream.on("close", () => {
				console.log(`closing stream with client (${ipAddress})`)
				client.emit("data", "you have closed the connection to ssh, you should try refreshing again")
				conn.end()
			}).on("data", data => {
				client.emit("data", stripAnsi(data.toString()))
			})
		})
	}).connect({
		host: "localhost",
		port: 22,
		username: config.sshUsername,
		password: config.sshPassword
	})
	client.emit("ping", "pong")
	client.on("event", data => {console.log(`${data} (${ipAddress})`)})
	// client.on("command", command => {console.log(`COMMAND: ${command} (${ipAddress})`)})
})

httpServer.listen(config.port, () => {
	console.log(`Server started at http://localhost:${config.port}`);
});