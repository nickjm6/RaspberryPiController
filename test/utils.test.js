const chai = require("chai")
const sinon = require("sinon")
const sinonChai = require("sinon-chai")

chai.use(sinonChai)

describe("testing functionality of the utils.js file", () => {
    describe("testing the getVol function", () => {
        const stubs = {}

        beforeEach(() => {
            sinon.restore()
        })

        after(() => {
            sinon.restore()
        })

        it("should be able to retrieve the volume in the happy path", async () => {

        })

        it("should fail if something goes wrong", async () => {

        })
    })

    describe("testing the setVol function", () => {
        const stubs = {}

        beforeEach(() => {
            sinon.restore()
        })

        after(() => {
            sinon.restore()
        })

        it("should be able to set the volume up", async () => {

        })

        it("should be able to set the volume down", async () => {

        })

        it("should fail if the direction parameter is invalid", async () => {
            
        })

        it("should fail if something goes wrong", async () => {
            
        })
    })
})