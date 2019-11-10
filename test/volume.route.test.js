const chai = require("chai")
const sinon = require("sinon")
const sinonChai = require("sinon-chai")
const request = require("supertest")

const utils = require("../src/utils")

chai.should()
chai.use(sinonChai)

let app = require("../src/server")

const baseRoute = "/volume"

const internalErrorMessage = require("../src/constants").messages.internalError

describe("testing functionality of the volume route", () => {
    describe("testing the / route", () => {
        const stubs = {}
        beforeEach(() => {
            sinon.restore()
            stubs.error = sinon.stub(console, "error");
        })

        after(() => {sinon.restore()})

        it("should be able to get the volume in the happy path", (done) => {
            const expectedResult = {volume: "50"}
            let getVol = sinon.stub(utils, "getVol").returns(expectedResult.volume)
            request(app)
                .get(baseRoute)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(200, expectedResult)
                .end(err => {
                    if(err)
                        return done(err)
                    getVol.should.have.been.calledOnce
                    stubs.error.should.have.not.been.called
                    done()
                })
        })

        it("should send generic message and log error if something goes wrong", (done) => {
            const error = new Error("ERROR")
            let getVol = sinon.stub(utils, "getVol").throws(error)
            request(app)
                .get(baseRoute)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(500, {message: internalErrorMessage})
                .end(err => {
                    if(err)
                        return done(err)
                    getVol.should.have.been.calledOnce
                    stubs.error.should.have.been.calledOnceWith(error)
                    done()
                })
        })
    })

    describe("testing the /up route", () => {
        const stubs = {}
        const route = `${baseRoute}/up`
        beforeEach(() => {
            sinon.restore()
            stubs.error = sinon.stub(console, "error");
        })

        after(() => {sinon.restore()})

        it("should be able to set the volume in the happy path", (done) => {
            const expectedResult = {volume: "53"}
            let setVol = sinon.stub(utils, "setVol").returns(expectedResult.volume)
            request(app)
                .post(route)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(200, expectedResult)
                .end(err => {
                    if(err)
                        return done(err)
                    setVol.should.have.been.calledOnceWith("+")
                    stubs.error.should.have.not.been.called
                    done()
                })
        })

        it("should send generic message and log error if something goes wrong", (done) => {
            const error = new Error("ERROR")
            let setVol = sinon.stub(utils, "setVol").throws(error)
            request(app)
                .post(route)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(500, {message: internalErrorMessage})
                .end(err => {
                    if(err)
                        return done(err)
                    setVol.should.have.been.calledOnceWith("+")
                    stubs.error.should.have.been.calledOnceWith(error)
                    done()
                })
        })
    })

    describe("testing the /down route", () => {
        const stubs = {}
        const route = `${baseRoute}/down`
        beforeEach(() => {
            sinon.restore()
            stubs.error = sinon.stub(console, "error");
        })

        after(() => {sinon.restore()})

        it("should be able to set the volume in the happy path", (done) => {
            const expectedResult = {volume: "47"}
            let setVol = sinon.stub(utils, "setVol").returns(expectedResult.volume)
            request(app)
                .post(route)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(200, expectedResult)
                .end(err => {
                    if(err)
                        return done(err)
                    setVol.should.have.been.calledOnceWith("-")
                    stubs.error.should.have.not.been.called
                    done()
                })
        })

        it("should send generic message and log error if something goes wrong", (done) => {
            const error = new Error("ERROR")
            let setVol = sinon.stub(utils, "setVol").throws(error)
            request(app)
                .post(route)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(500, {message: internalErrorMessage})
                .end(err => {
                    if(err)
                        return done(err)
                    setVol.should.have.been.calledOnceWith("-")
                    stubs.error.should.have.been.calledOnceWith(error)
                    done()
                })
        })
    })
})