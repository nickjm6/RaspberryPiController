const chai = require("chai")
const sinon = require("sinon")
const sinonChai = require("sinon-chai")
const supertest = require("supertest")

const childProcess = require("child_process")

chai.use(sinonChai)

describe("testing functionality of the operatingSystem routes", () => {
    describe("testing the /current route", () => {
        it("should return proper currentOs value from config", (done) => {
            done()
        })
    })

    describe("testing the /other route", () => {
        it("should return proper operating system list from config", (done) => {
            done()
        })
    })

    describe("testing the /switch route", () => {
        let stubs = {};

        beforeEach(() => {
            sinon.restore()
            stubs.log = sinon.stub(console, "log")
            stubs.error = sinon.stub(console, "error")
        })

        after(() => sinon.restore)

        it("should switch route in the happy path", (done) => {
            done()
        })

        it("should throw a 400 if osName is undefined", (done) => {
            done()
        });

        it("should throw a 400 if osName is invalid", (done) => {
            done()
        })
    })
})