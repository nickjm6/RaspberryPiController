let router = require("express").Router();

const { osName, otherOperatingSystems } = require("../../config")
const utils = require("../utils")
const internalErrorMessage = require("../constants").messages.internalError

router.get("/", async (req, res) => {
    try {
        let volume = await utils.getVol();
        res.json({
            currentOS: osName,
            otherOperatingSystems,
            volume
        })
    } catch (err) {
        res.status(500).json({ message: internalErrorMessage })
    }
})

module.exports = router