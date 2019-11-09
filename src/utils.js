const { execSync } = require("child_process")

const volScript = "../scripts/vol"

let getVol = async () => {
    let result = execSync(volScript)
    if (result.stderr)
        throw new Error(result.stderr)
    return parseInt(result);
}

let setVol = async direction => {
    if (["+", "-"].includes(direction)) {
        let result = execSync(`${volScript} ${direction}`)
        if (result.stderr)
            throw new Error(result.stderr)
        return parseInt(result)
    } else {
        throw new Error("Please pass in '+' or '-' for direction in setVol")
    }
}

module.exports = { getVol, setVol }