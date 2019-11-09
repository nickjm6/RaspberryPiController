let router = require("express").Router();

const {getVol, setVol} = require("../utils")

const internalErrorMessage = require("../constants").messages.internalError

router.get("/", async (req, res) => {
    try{
        let volume = await getVol();
        res.json({volume})
    } catch(err){
        console.error(err);
        res.status(500).json({message: internalErrorMessage})
    }
})


router.post("/up", async (req, res) => {
	try {
        let volume = await setVol("+");
        res.json({volume})
    } catch(err){
        console.error(err);
        res.status(500).json({message: internalErrorMessage})
    }
})

router.post("/volumedown", async (req, res) => {
	try {
        let volume = await setVol("-");
        res.json({volume})
    } catch(err){
        console.error(err);
        res.status(500).json({message: internalErrorMessage})
    }
})

module.exports = router