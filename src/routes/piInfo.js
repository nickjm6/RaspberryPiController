let router = require("express").Router();

const {osName, otherOperatingSystems} = require("../../config")
const {getVol} = require("../utils")

router.get("/", (req, res) => {
    let volume = getVol();
    res.json({
        currentOS: osName,
        otherOperatingSystems,
        volume
    })
})

module.exports = router