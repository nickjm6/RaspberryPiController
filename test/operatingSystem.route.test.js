const chai = require("chai")
const sinon = require("sinon")
const sinonChai = require("sinon-chai")
const request = require("supertest")

const childProcess = require("child_process")

const app = require("../src/server")

chai.should()
chai.use(sinonChai)

let currentOS;
let otherOperatingSystems;
try {
    const config = require("../config")
    currentOS = config.osName
    otherOperatingSystems = config.otherOperatingSystems
    if (!currentOS || !otherOperatingSystems)
        throw new Error();
} catch (err) {
    throw new Error("Environment is not set up properly, please run 'npm run build'")
}

const rebootMessage = require("../src/constants").messages.reboot
const route = "/operatingSystem"

describe("testing functionality of the operatingSystem routes", () => {
    describe("testing the /current route", () => {
        it("should return proper currentOs value from config", (done) => {
            request(app)
                .get(`${route}/current`)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(200, { currentOS }, done)
        })
    })

    describe("testing the /other route", () => {
        it("should return proper operating system list from config", (done) => {
            request(app)
                .get(`${route}/other`)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(200, { otherOperatingSystems }, done)
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
            let execStub = sinon.stub(childProcess, "execSync").returns({})
            let osName = otherOperatingSystems[0]
            request(app)
                .post(`${route}/switch`)
                .send({ osName })
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(200, { message: rebootMessage })
                .end(err => {
                    if (err) {
                        return done(err);
                    }
                    let expectedLog = `attempting to switch to: ${osName}`
                    stubs.log.should.have.been.calledOnceWith(expectedLog)
                    execStub.should.have.been.calledOnceWith(osName.toLowerCase())
                    stubs.error.should.have.not.been.called
                    done()
                })
        })

        it("should throw a 400 if osName is undefined", (done) => {
            let execStub = sinon.stub(childProcess, "execSync").returns({})
            request(app)
                .post(`${route}/switch`)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(400, { message: "Please enter a valid OS" })
                .end(err => {
                    if (err) {
                        return done(err);
                    }
                    let expectedLog = `attempting to switch to: undefined`
                    stubs.log.should.have.been.calledOnceWith(expectedLog)
                    execStub.should.have.not.been.called
                    stubs.error.should.have.not.been.called
                    done()
                })
        });

        it("should throw a 400 if osName is invalid", (done) => {
            let execStub = sinon.stub(childProcess, "execSync").returns({})
            let osName = "Invalid"
            request(app)
                .post(`${route}/switch`)
                .send({ osName })
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(400, { message: "Invalid OS" })
                .end(err => {
                    if (err) {
                        return done(err);
                    }
                    let expectedLog = `attempting to switch to: ${osName}`
                    stubs.log.should.have.been.calledOnceWith(expectedLog)
                    execStub.should.have.not.been.called
                    stubs.error.should.have.not.been.called
                    done()
                })
        })

        it("should log error if error occurs", (done) => {
            let result = {stderr: "ERROR"}
            let execStub = sinon.stub(childProcess, "execSync").returns(result)
            let osName = otherOperatingSystems[0]
            request(app)
                .post(`${route}/switch`)
                .send({ osName })
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(200, { message: rebootMessage })
                .end(err => {
                    if (err) {
                        return done(err);
                    }
                    let expectedLog = `attempting to switch to: ${osName}`
                    stubs.log.should.have.been.calledOnceWith(expectedLog)
                    execStub.should.have.been.calledOnceWith(osName.toLowerCase())
                    stubs.error.should.have.been.calledOnceWith(result.stderr)
                    done()
                })
        })
    })
})