const chai = require("chai")
const sinon = require("sinon")
const sinonChai = require("sinon-chai")
const supertest = require("supertest")

chai.use(sinonChai)

describe("testing functionality of the volume route", () => {
    describe("testing the / route", () => {
        const stubs = {}
        beforeEach(() => {
            sinon.restore()
            stubs.error = sinon.stub(console, "error");
        })

        after(() => {sinon.restore()})

        it("should be able to get the volume in the happy path", (done) => {
            done();
        })

        it("should send generic message and log error if something goes wrong", (done) => {
            done()
        })
    })

    describe("testing the /up route", () => {
        const stubs = {}
        beforeEach(() => {
            sinon.restore()
            stubs.error = sinon.stub(console, "error");
        })

        after(() => {sinon.restore()})

        it("should be able to set the volume in the happy path", (done) => {
            done();
        })

        it("should send generic message and log error if something goes wrong", (done) => {
            done()
        })
    })

    describe("testing the /down route", () => {
        const stubs = {}
        beforeEach(() => {
            sinon.restore()
            stubs.error = sinon.stub(console, "error");
        })

        after(() => {sinon.restore()})

        it("should be able to set the volume in the happy path", (done) => {
            done();
        })

        it("should send generic message and log error if something goes wrong", (done) => {
            done()
        })
    })
})