const request = require("supertest")

const chai = require("chai")
const sinon = require("sinon")
const sinonChai = require("sinon-chai")
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

let app = require("../src/server")
const route = `/piInfo`

describe("testing functionality of the piInfo route", () => {
    after(() => {sinon.restore()})

    it("should return proper pi information back", (done) => {
        const expectedVol = 50;
        const expectedResult = {currentOS, otherOperatingSystems, volume: expectedVol}
        const getVol = sinon.stub(require("../src/utils"), "getVol").returns(expectedVol)
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
    })
})