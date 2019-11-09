let config = {}

try {
	config = require("./config")
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

const server = require("./src/server")

server.listen(config.port, () => {
	console.log(`Server started at http://localhost:${config.port}`);
});