const chai = require("chai")
const sinon = require("sinon")
const sinonChai = require("sinon-chai")
const supertest = require("supertest")

chai.use(sinonChai)

describe("testing functionality of the power routes", () => {
    describe("testing the /reboot route", () => {
        const stubs = {}
        beforeEach(() => {
            sinon.restore()
            stubs.log = sinon.stub(console, "log")
            stubs.error = sinon.stub(console, "error")
        })

        after(() => {sinon.restore()})

        it("should work in the happy path", (done) => {
            done()
        })

        it("should log error if something goes wrong", (done) => {
            done()
        })
    })

    describe("testing the /off route", () => {
        const stubs = {}
        beforeEach(() => {
            sinon.restore()
            stubs.log = sinon.stub(console, "log")
            stubs.error = sinon.stub(console, "error")
        })

        after(() => {sinon.restore()})

        it("should work in the happy path", (done) => {
            done()
        })

        it("should log error if something goes wrong", (done) => {
            done()
        })
    })
})