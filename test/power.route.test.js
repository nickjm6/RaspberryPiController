const chai = require("chai")
const sinon = require("sinon")
const sinonChai = require("sinon-chai")
const request = require("supertest")
const childProcess = require("child_process")

chai.should()
chai.use(sinonChai)

let app = require("../src/server")

const rebootMessage = require("../src/constants").messages.reboot
const baseRoute = "/power"

describe("testing functionality of the power routes", () => {
    describe("testing the /reboot route", () => {
        const stubs = {}
        const route = `${baseRoute}/reboot`
        beforeEach(() => {
            sinon.restore()
            stubs.log = sinon.stub(console, "log")
            stubs.error = sinon.stub(console, "error")
        })

        after(() => {sinon.restore()})

        it("should work in the happy path", (done) => {
            let execSync = sinon.stub(childProcess, "execSync").returns({})
            request(app)
                .post(route)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(200, {message: rebootMessage})
                .end(err => {
                    if(err)
                        return done(err)
                    execSync.should.have.been.calledOnceWith("sudo reboot")
                    stubs.log.should.have.been.calledOnceWith("attempting reboot")
                    stubs.error.should.have.not.been.called
                    done()
                })
        })

        it("should log error if something goes wrong", (done) => {
            const result = {stderr: "ERROR"}
            let execSync = sinon.stub(childProcess, "execSync").returns(result)
            request(app)
                .post(route)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(200, {message: rebootMessage})
                .end(err => {
                    if(err)
                        return done(err)
                    execSync.should.have.been.calledOnceWith("sudo reboot")
                    stubs.log.should.have.been.calledOnceWith("attempting reboot")
                    stubs.error.should.have.been.calledOnceWith(result.stderr)
                    done()
                })
        })
    })

    describe("testing the /off route", () => {
        const stubs = {}
        const route = `${baseRoute}/off`
        beforeEach(() => {
            sinon.restore()
            stubs.log = sinon.stub(console, "log")
            stubs.error = sinon.stub(console, "error")
        })

        after(() => {sinon.restore()})

        it("should work in the happy path", (done) => {
            let execSync = sinon.stub(childProcess, "execSync").returns({})
            request(app)
                .post(route)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(200, {message: rebootMessage})
                .end(err => {
                    if(err)
                        return done(err)
                    execSync.should.have.been.calledOnceWith("sudo poweroff")
                    stubs.log.should.have.been.calledOnceWith("attempting to turn power off")
                    stubs.error.should.have.not.been.called
                    done()
                })
        })

        it("should log error if something goes wrong", (done) => {
            const result = {stderr: "ERROR"}
            let execSync = sinon.stub(childProcess, "execSync").returns(result)
            request(app)
                .post(route)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(200, {message: rebootMessage})
                .end(err => {
                    if(err)
                        return done(err)
                    execSync.should.have.been.calledOnceWith("sudo poweroff")
                    stubs.log.should.have.been.calledOnceWith("attempting to turn power off")
                    stubs.error.should.have.been.calledOnceWith(result.stderr)
                    done()
                })
        })
    })
})