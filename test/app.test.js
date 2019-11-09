const request = require("supertest")

const app = require("../src/server");

describe("testing functionality of the main app.js file", () => {
    it("should send back correct signature on ping", (done) => {
        let signature
        try{
            signature = require("../config").signature
            if(!signature)
                throw new Error();
            
        } catch (err){
            throw new Error("Environment is not set up properly, please run 'npm run build'")
        }
        request(app)
            .get("/ping")
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(200, {message: signature}, done)
    })

    it("should send back index.html on base route", (done) => {
        done()
    })
})