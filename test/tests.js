var chai = require("chai");
var assert = chai.assert;
var expect = chai.expect;

var querystring = require("querystring");

var requests = require("../config/requests");
var getAddr = require("../config/getAddr")
var formRequest = requests.formRequest;
var httpGet = requests.get;
var httpPost = requests.post;

var sig = "MyRazPi";
var osList = ["raspbian", "rasplex", "retropie", "kodi"];

describe("Server tests", function(){
	describe("Request tests", function(){
		it("should be able to get request to google", function(done){
			httpGet("http://www.google.com").then(function(data){
				done();
			}).catch(function(e){
				done(e);
			});
		});

		it("should not be able to get request to random url", function(done){
			requests.get("asdfasdfasdf", function(){
				done(new Error("This should not have worked"));
			}).catch(function(e){
				done();
			})
		})

		it("should be able to find the pi address", function(done){
			getAddr().then(function(d){
				done();
			}).catch(function(e){
				done(e);
			})
		})
	});

	describe("Get Request tests directly to raspberry pi", function(){
		var piAddress;
		before(function(done){
			getAddr().then(function(d){
				piAddress = d;
				done()
			}).catch(function(e){
				done(e);
			})
		});

		it("should be able to request pi signiture from the raspberry pi", function(done){
			httpGet(formRequest(piAddress)).then(function(d){
				expect(d).to.equal(sig)
				done();
			}).catch(function(e){
				done(e);
			})
		});

		it("should be able to get the current os from the raspberry pi", function(done){
			httpGet(formRequest(piAddress, "currentOS")).then(function(d){
				expect(osList).to.include(d)
				done();
			}).catch(function(e){
				done(e);
			})
		})

		it("should be able to get the volume from the raspberry pi", function(done){
			httpGet(formRequest(piAddress, "getVol")).then(function(d){
				var vol = parseInt(d);
				assert.isBelow(vol, 101);
				assert.isAtLeast(vol, 0);
				done();
			}).catch(function(e){
				done(e);
			})
		})

		it("should be able to get the volume and os from the raspberry pi", function(done){
			httpGet(formRequest(piAddress, "osAndVolume")).then(function(data){
				var res = querystring.parse(data);
				var volume = parseInt(res.volume);
				var os = res.os;
				assert.isBelow(volume, 101);
				assert.isAtLeast(volume, 0);
				expect(osList).to.include(os);
				done();
			}).catch(function(e){
				done(e);
			})
		})
	});

	describe("Post Request tests directly to raspberry pi", function(){

		this.timeout(3000)

		var piAddress;
		before(function(done){
			getAddr().then(function(d){
				piAddress = d;
				done();
			}).catch(function(e){
				done(e);
			})
		});

		it.skip("should be able to reboot the raspberry pi", function(done){

		});

		it.skip("should be able to switch to raspbian", function(done){
	
		});

		it.skip("should be able to switch to kodi", function(done){
			
		});

		it.skip("should be able to switch to rasplex", function(done){
			
		});

		it.skip("should be able to switch to retropie", function(done){
			
		});

		it.skip("should be able to boot on hdmi", function(done){
			
		});

		it.skip("should be able to boot to rca", function(done){
			
		});

		it("should be able to turn the volume up", function(done){
			httpGet(formRequest(piAddress, "getVol")).then(function(res){
				var expected;
				var vol = parseInt(res);
				if(vol > 95)
					expected = 100;
				else
					expected = vol + 5;
				httpPost("/volumeup", {}, piAddress).then(function(data){
					assert.equal(parseInt(data), expected)
					done();
				}).catch(function(e){
					done(e);
				})
			})

		});

		it("should be able to turn the volume down", function(done){
			httpGet(formRequest(piAddress, "getVol")).then(function(res){
				var expected;
				var vol = parseInt(res);
				if(vol < 5)
					expected = 0;
				else
					expected = vol - 5;
				httpPost("/volumedown", {}, piAddress).then(function(data){
					assert.equal(parseInt(data), expected)
					done();
				}).catch(function(e){
					done(e);
				})
			})
		});

	})

	describe("Get requests to server", function(){

		it.skip("should be able to get the pi address from the server", function(done){
			
		})

		it.skip("should be able to get the current os from the server", function(done){
			
		});

		it.skip("should be able to get the volume from the server", function(done){
			
		});

		it.skip("should be able to get the piInfo from the server", function(done){
			
		})
	});

	describe("Post requests to server", function(){
		it.skip("should be able to reboot the raspberry pi from the server", function(done){
			
		});

		it.skip("should be able to switch to raspbian from the server", function(done){
			
		});

		it.skip("should be able to switch to rasplex from the server", function(done){
			
		});

		it.skip("should be able to switch to kodi from the server", function(done){
			
		});

		it.skip("should be able to boot to hdmi from the server", function(done){
			
		});

		it.skip("should be able to boot to rca from the server", function(done){
			
		});

		it.skip("should be able to turn the volume up from the server", function(done){
			
		});

		it.skip("should be able to turn the volume down from the server", function(done){
			
		});
	})

})