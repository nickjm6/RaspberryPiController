let router = require("express").Router()
const { execSync } = require("child_process")

let config = require("../../config.json")

const {osName, otherOperatingSystems} = config;
const rebootMessage = require("../constants").messages.reboot

router.get("/current", (req, res) => {
    res.json({currentOS: osName})
});

router.get("/other", (req, res) => {
    res.json({otherOperatingSystems})
})

router.post("/switch", (req, res) => {
	let osName = req.body.osName
	console.log(`attempting to switch to: ${osName}`)
	if (osName === undefined) {
		res.status(400).json({message: "Please enter a valid OS"});
		return;
	}
	osName = osName.toLowerCase()
	if (config.otherOperatingSystems.includes(osName)) {
        res.json({message: rebootMessage})
        result = execSync(osName)
		result = {}
		if (result.stderr) {
			console.error(result.stderr)
		}
	}
	else {
		res.status(400).json({message: "Invalid OS"})
	}
});

module.exports = router;