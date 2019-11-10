let router = require("express").Router();

const {osName, otherOperatingSystems} = require("../../config")
const utils = require("../utils")

router.get("/", (req, res) => {
    let volume = utils.getVol();
    res.json({
        currentOS: osName,
        otherOperatingSystems,
        volume
    })
})

module.exports = router