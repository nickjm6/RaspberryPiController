const chai = require("chai")
const sinon = require("sinon")
const sinonChai = require("sinon-chai")
const assert = chai.assert

const childProcess = require("child_process")
const utils = require("../src/utils")

chai.should()
chai.use(sinonChai)

const volScript = "./scripts/vol"

describe("testing functionality of the utils.js file", () => {
    describe("testing the getVol function", () => {
        beforeEach(() => {sinon.restore()})

        after(() => {sinon.restore()})

        it("should be able to retrieve the volume in the happy path", async () => {
            let expected = 50;
            let execSync = sinon.stub(childProcess, "execSync").returns(expected)
            let volume = await utils.getVol()
            assert.equal(volume, expected)
            execSync.should.have.been.calledOnceWith(volScript)
        })

        it("should fail if something goes wrong", async () => {
            let result = {stderr: "ERROR"};
            let execSync = sinon.stub(childProcess, "execSync").returns(result)
            try{
                let volume = await utils.getVol()
            }catch(err){
                execSync.should.have.been.calledOnceWith(volScript)
                assert.equal(err.message, result.stderr)
                return;
            }
            throw new Error("Should have rejected")
        })
    })

    describe("testing the setVol function", () => {
        beforeEach(() => {sinon.restore()})

        after(() => {sinon.restore()})

        it("should be able to set the volume up", async () => {
            let expected = 53;
            let execSync = sinon.stub(childProcess, "execSync").returns(expected)
            let volume = await utils.setVol("+")
            assert.equal(volume, expected)
            execSync.should.have.been.calledOnceWith(`${volScript} +`)
        })

        it("should be able to set the volume down", async () => {
            let expected = 47;
            let execSync = sinon.stub(childProcess, "execSync").returns(expected)
            let volume = await utils.setVol("-")
            assert.equal(volume, expected)
            execSync.should.have.been.calledOnceWith(`${volScript} -`)
        })

        it("should fail if the direction parameter is invalid", async () => {
            let expected = 53;
            let execSync = sinon.stub(childProcess, "execSync").returns(expected)
            try{
                let volume = await utils.setVol("UP")
            }catch(err){
                execSync.should.have.not.been.called
                assert.equal(err.message, "Please pass in '+' or '-' for direction in setVol")
                return;
            }
            throw new Error("Should have rejected")
        })

        it("should fail if something goes wrong", async () => {
            let result = {stderr: "ERROR"};
            let execSync = sinon.stub(childProcess, "execSync").returns(result)
            try{
                let volume = await utils.setVol("+")
            }catch(err){
                execSync.should.have.been.calledOnceWith(`${volScript} +`)
                assert.equal(err.message, result.stderr)
                return;
            }
            throw new Error("Should have rejected")
        })
    })
})