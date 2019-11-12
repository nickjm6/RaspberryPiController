let requiredVariables = require("./env.json")

let config = {}
const readline = require('readline')
const fs = require("fs")

let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

try{
    config = require("./config")
}catch (err) {}


let checkVariable = (name, description, type, defaultValue) => new Promise(resolve => {
    const configVal = config[name]
    if(!configVal){
        let q = `Please supply '${name}' - ${description}: `;
        rl.question(q, a => {
            a = a.trim()
            if(a == ""){
                a = defaultValue
            } else if(type == "array"){
                a = a.split(/\s+/)
            } else if (type == "number"){
                a = parseInt(a) || defaultValue
            }
            config[name] = a
            resolve(false)
        })
    }else{
        resolve(true)
    }
})

let checkVariables = async () => {
    let clean = true;
    for(let i = 0; i < requiredVariables.length; i++){
        let variable = requiredVariables[i]
        let res = await checkVariable(variable.name, variable.description, variable.type, variable.default)
        if(!res)
            clean = false;
    }
    return clean;
};

(async () => {
    let clean = await checkVariables()
    rl.close()
    if(!clean){
        let res = JSON.stringify(config, null, 2)
        fs.writeFileSync("config.json", res)
    }
    console.log("Successfully set environment, now waiting for react to build...")
})()
