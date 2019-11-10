let router = require("express").Router();

const utils = require("../utils")

const internalErrorMessage = require("../constants").messages.internalError

router.get("/", async (req, res) => {
    try{
        let volume = await utils.getVol();
        res.json({volume})
    } catch(err){
        console.error(err);
        res.status(500).json({message: internalErrorMessage})
    }
})


router.post("/up", async (req, res) => {
	try {
        let volume = await utils.setVol("+");
        res.json({volume})
    } catch(err){
        console.error(err);
        res.status(500).json({message: internalErrorMessage})
    }
})

router.post("/down", async (req, res) => {
	try {
        let volume = await utils.setVol("-");
        res.json({volume})
    } catch(err){
        console.error(err);
        res.status(500).json({message: internalErrorMessage})
    }
})

module.exports = router