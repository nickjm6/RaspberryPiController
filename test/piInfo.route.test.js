const request = require("supertest")

const chai = require("chai")
const sinon = require("sinon")
const sinonChai = require("sinon-chai")
chai.should()
chai.use(sinonChai)

const assert = chai.assert

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

let app = require("../src/server")
const route = `/piInfo`

describe("testing functionality of the piInfo route", () => {
    beforeEach(() => {sinon.restore()})

    after(() => {sinon.restore()})

    it("should return proper pi information back", (done) => {
        const expectedVol = 50;
        const expectedResult = {currentOS, otherOperatingSystems, volume: expectedVol}
        const getVol = sinon.stub(require("../src/utils"), "getVol").resolves(expectedVol)
        request(app)
            .get(route)
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(200, expectedResult)
            .end(err => {
                if(err){
                    return done(err)
                }
                getVol.should.have.been.calledOnce;
                done()
            })
    });

    it("should send an internal error if the volume cannot be retrieved", (done) => {
        const errorMessage = "ERROR";
        const message = require("../src/constants").messages.internalError
        const expectedResult = {message}
        const getVol = sinon.stub(require("../src/utils"), "getVol").rejects(new Error(errorMessage))
        request(app)
            .get(route)
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(500, expectedResult)
            .end(err => {
                if(err){
                    return done(err)
                } 
                getVol.should.have.been.calledOnce;
                done()
            })
    })
})