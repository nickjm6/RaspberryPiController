let router = require("express").Router()
const childProcess = require("child_process")

const rebootMessage = require("../constants").messages.reboot

router.post("/reboot", (req, res) => {
    console.log("attempting reboot")
	res.json({message: rebootMessage})
    result = {}
	result = childProcess.execSync("sudo reboot")
	if (result.stderr) {
		console.error(result.stderr)
	}
});

router.post("/off", (req, res) => {
    console.log("attempting to turn power off")
	res.json({message: rebootMessage})
    result = {}
	result = childProcess.execSync("sudo poweroff")
	if (result.stderr) {
		console.error(result.stderr)
	}
})

module.exports = router
