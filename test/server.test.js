const request = require("supertest")

const app = require("../src/server");

let signature
try{
    signature = require("../config").signature
    if(!signature)
        throw new Error();
    
} catch (err){
    throw new Error("Environment is not set up properly, please run 'npm run build'")
}

describe("testing functionality of the main server.js file", () => {
    it("should send back correct signature on ping", (done) => {
        request(app)
            .get("/ping")
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(200, {message: signature}, done)
    })

    it("should send back index.html on base route", (done) => {
        request(app)
            .get("/")
            .expect("Content-Type", "text/html; charset=UTF-8")
            .expect(200, done)
    })
})