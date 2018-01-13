var chai = require("chai");
var assert = chai.assert;
var expect = chai.expect;

var querystring = require("querystring");

var requests = require("../config/requests");
var getAddr = require("../config/getAddr");
var formRequest = requests.formRequest;
var httpGet = requests.get;
var httpPost = requests.post;

var User = require("../config/user")

var mongoose = require('mongoose');
var mongoDB = "mongodb://localhost/test"

var regIP = new RegExp("^192\.168\.[0-2]\.[0-9]{1,2}$");


var sig = "MyRazPi";
var osList = ["raspbian", "rasplex", "retropie", "kodi"];

describe("db tests", function(){
	var db;

	before(function(done){
		mongoose.connect(mongoDB, {
			useMongoClient: true
		});
		done();
	})

	it("should not already have a user with the id 'fakeid'", function(done){
		User.remove({}, function(err){
			if(err)
				return done(err);
		});
		User.findOne({"google.id": "fakeid"}, function(err, user){
			if(err)
				return done(err)
			if(user){
				user.remove();
				return done(new Error("the user should not have been found"))
			}
			return done();
		})
	})

	it("should be able to save a fake user", function(done){
		var newUser = new User();
		newUser.google.id = "fakeid";
		newUser.google.token = "faketoken";
		newUser.google.name = "fakename";
		newUser.google.email = "fakeemail";

		newUser.save(function(err){
			if(err)
				return done(err);
			return done();
		})
	})

	it("should be able to retrive a fake user", function(done){
		User.findOne({"google.id": "fakeid"}, function(err, user){
			if(err)
				return done(err);
			if(user){
				expect(user.google.id).to.equal("fakeid");
				expect(user.google.token).to.equal("faketoken");
				expect(user.google.name).to.equal("fakename");
				expect(user.google.email).to.equal("fakeemail");
				return done();
			}
			return done(new Error("The user was not found"))
		})
	})

	it("should be able to delete a user", function(done){
		User.findOne({"google.id": "fakeid"}, function(err, user){
			if(err)
				return done(err);
			if(user){
				user.remove();
				return done();
			}
			done(new Error("the user should have geen found"));
		})
	})

	it("should make sure that a user does not exist after deletion", function(done){
		User.findOne({"google.id": "fakeid"}, function(err, user){
			if(err)
				return done(err)
			if(user)
				return done(new Error("The user should have been deleted"));
			done();
		})
	})

});

describe("Server tests", function(){
	describe("Request tests", function(){
		this.timeout(5000)

		it("should be able to get request to google", function(done){
			httpGet("www.google.com").then(function(data){
				done();
			}).catch(function(e){
				done(e);
			});
		});

		it("should be able to find the pi address", function(done){
			getAddr().then(function(d){
				expect(regIP.test(d)).to.be.true;
				done();
			}).catch(function(e){
				done(e);
			})
		})
	});

	describe("Get requests to server", function(){

		this.timeout(5000);

		it("should be able to get the pi address from the server", function(done){
			httpGet("myrazpi.com", "piAddress").then(function(data){
				expect(regIP.test(data)).to.be.true;
				done()
			}).catch(function(e){
				done(e);
			})
		})

		it("should be able to get the current os from the server", function(done){
			httpGet("myrazpi.com", "currentOS").then(function(data){
				expect(osList).to.include(data)
				done();
			}).catch(function(e){
				done(e);
			})
		});

		it("should be able to get the volume from the server", function(done){
			httpGet("myrazpi.com", "getVol").then(function(data){
				var vol = parseInt(data);
				assert.isBelow(vol, 101);
				assert.isAtLeast(vol, 0);
				done();
			}).catch(function(e){
				done(e);
			})
		});

		it("should be able to get the piInfo from the server", function(done){
			requests.getJSON("myrazpi.com", "piInfo").then(function(res){
				var volume = parseInt(res.volume);
				var os = res.os;
				var piAddr = res.piAddress;
				assert.isBelow(volume, 101);
				assert.isAtLeast(volume, 0);
				expect(osList).to.include(os);
				expect(regIP.test(piAddr)).to.be.true;
				done();
			}).catch(function(e){
				done(e);
			})
		})
	});

	describe("Get requests to localhost", function(){

		this.timeout(5000);

		it("should be able to get the pi address from localhost", function(done){
			httpGet("localhost", "piAddress").then(function(data){
				expect(regIP.test(data)).to.be.true;
				done()
			}).catch(function(e){
				done(e);
			})
		})

		it("should be able to get the current os from localhost", function(done){
			httpGet("localhost", "currentOS").then(function(data){
				expect(osList).to.include(data)
				done();
			}).catch(function(e){
				done(e);
			})
		});

		it("should be able to get the volume from localhost", function(done){
			httpGet("localhost", "getVol").then(function(data){
				var vol = parseInt(data);
				assert.isBelow(vol, 101);
				assert.isAtLeast(vol, 0);
				done();
			}).catch(function(e){
				done(e);
			})
		});

		it("should be able to get the piInfo from localhost", function(done){
			requests.getJSON("localhost", "piInfo").then(function(res){
				var volume = parseInt(res.volume);
				var os = res.os;
				var piAddr = res.piAddress;
				assert.isBelow(volume, 101);
				assert.isAtLeast(volume, 0);
				expect(osList).to.include(os);
				expect(regIP.test(piAddr)).to.be.true;
				done();
			}).catch(function(e){
				done(e);
			})
		})
	});

	describe.skip("Post requests token to server", function(){
		it("should be able to reboot using token request", function(done){
			var token = null;
			httpPost("myrazpi.com", "reboot-token", {id_token: token, test: true}).then(function(data){
				done()
			}).catch(function(e){
				done(e)
			})
		})

		it("should be able to switch to raspbian using token request", function(done){
			var token = null;
			httpPost("myrazpi.com", "switchOS-token", {osName: "raspbian", id_token: token, test: true}).then(function(data){
				done()
			}).catch(function(e){
				done(e)
			})
		})

		it("should be able to switch to raplex using token request", function(done){
			var token = null;
			httpPost("myrazpi.com", "switchOS-token", {osName: "rasplex", id_token: token, test: true}).then(function(data){
				done()
			}).catch(function(e){
				done(e)
			})
		})

		it("should be able to switch to kodi using token request", function(done){
			var token = null;
			httpPost("myrazpi.com", "switchOS-token", {osName: "kodi", id_token: token, test: true}).then(function(data){
				done()
			}).catch(function(e){
				done(e)
			})
		})

		it("should be able to switch to retropie using token request", function(done){
			var token = null;
			httpPost("myrazpi.com", "switchOS-token", {osName: "retropie", id_token: token, test: true}).then(function(data){
				done()
			}).catch(function(e){
				done(e)
			})
		})

		it("should be able to boot on hdmi using token request", function(done){
			var token = null;
			httpPost("myrazpi.com", "hdmi-token", {id_token: token, test: true}).then(function(data){
				done()
			}).catch(function(e){
				done(e)
			})
		})

		it("should be able to boot to rca using token request", function(done){
			var token = null;
			httpPost("myrazpi.com", "rca-token", {id_token: token, test: true}).then(function(data){
				done()
			}).catch(function(e){
				done(e)
			})
		})

		it("should be able to turn the volume up", function(done){
			httpGet("myrazpi.com", "getVol").then(function(res){
				var expected;
				var vol = parseInt(res);
				if(vol > 95)
					expected = 100;
				else
					expected = vol + 5;
				httpPost("myrazpi.com", "volumeup").then(function(data){
					assert.equal(parseInt(data), expected)
					done();
				}).catch(function(e){
					done(e);
				})
			})

		});

		it("should be able to turn the volume down", function(done){
			httpGet("myrazpi.com", "getVol").then(function(res){
				var expected;
				var vol = parseInt(res);
				if(vol < 5)
					expected = 0;
				else
					expected = vol - 5;
				httpPost("myrazpi.com", "volumedown").then(function(data){
					assert.equal(parseInt(data), expected)
					done();
				}).catch(function(e){
					done(e);
				})
			})
		});
	})

	describe.skip("Post requests token to localhost", function(){
		it("should be able to reboot using token request", function(done){
			var token = null;
			httpPost("localhost", "reboot-token", {id_token: token, test: true}).then(function(data){
				done()
			}).catch(function(e){
				done(e)
			})
		})

		it("should be able to switch to raspbian using token request", function(done){
			var token = null;
			httpPost("localost", "switchOS-token", {osName: "raspbian", id_token: token, test: true}).then(function(data){
				done()
			}).catch(function(e){
				done(e)
			})
		})

		it("should be able to switch to raplex using token request", function(done){
			var token = null;
			httpPost("localhost", "switchOS-token", {osName: "rasplex", id_token: token, test: true}).then(function(data){
				done()
			}).catch(function(e){
				done(e)
			})
		})

		it("should be able to switch to kodi using token request", function(done){
			var token = null;
			httpPost("localhost", "switchOS-token", {osName: "kodi", id_token: token, test: true}).then(function(data){
				done()
			}).catch(function(e){
				done(e)
			})
		})

		it("should be able to switch to retropie using token request", function(done){
			var token = null;
			httpPost("localhost", "switchOS-token", {osName: "retropie", id_token: token, test: true}).then(function(data){
				done()
			}).catch(function(e){
				done(e)
			})
		})

		it("should be able to boot on hdmi using token request", function(done){
			var token = null;
			httpPost("localhost", "hdmi-token", {id_token: token, test: true}).then(function(data){
				done()
			}).catch(function(e){
				done(e)
			})
		})

		it("should be able to boot to rca using token request", function(done){
			var token = null;
			httpPost("localhost", "rca-token", {id_token: token, test: true}).then(function(data){
				done()
			}).catch(function(e){
				done(e)
			})
		})

		it("should be able to turn the volume up", function(done){
			httpGet("localhost", "getVol").then(function(res){
				var expected;
				var vol = parseInt(res);
				if(vol > 95)
					expected = 100;
				else
					expected = vol + 5;
				httpPost("localhost", "volumeup").then(function(data){
					assert.equal(parseInt(data), expected)
					done();
				}).catch(function(e){
					done(e);
				})
			})

		});

		it("should be able to turn the volume down", function(done){
			httpGet("localhost", "getVol").then(function(res){
				var expected;
				var vol = parseInt(res);
				if(vol < 5)
					expected = 0;
				else
					expected = vol - 5;
				httpPost("myrazpi.com", "volumedown").then(function(data){
					assert.equal(parseInt(data), expected)
					done();
				}).catch(function(e){
					done(e);
				})
			})
		});
	})

});

describe("raspbian tests", function(){
	this.timeout(5000)

	var piAddress
	before(function(done){
		getAddr().then(function(data){
			piAddress = data
			done();
		}).catch(function(err){
			done(err);
		})
	});

	it("should already be on raspbian", function(done){
		httpGet(piAddress, "currentOS").then(function(data){
			if(data === "raspbian")
				return done();
			httpPost(piAddress, "switchOS", {osName: "raspbian"}).then(function(){
				console.log("Switching to raspbian for consistancy. Please wait 35 seconds");
				setTimeout(done, 35000);
			}).catch(function(err){
				done(err);
			})
		}).catch(function(e){
			done(e)
		})
	}).timeout(40000);

	it("should reboot the raspberry pi", function(done){
		httpPost(piAddress, "reboot", {test: true}).then(function(data){
			expect(data).to.equal("success")
			done();
		}).catch(function(err){
			done(err);
		})
	})

	it("should boot to rca", function(done){
		httpPost(piAddress, "rca", {test: true}).then(function(data){
			expect(data).to.equal("success")
			done();
		}).catch(function(err){
			done(err);
		})
	})
	it("should boot to hdmi", function(done){
		httpPost(piAddress, "hdmi", {test: true}).then(function(data){
			expect(data).to.equal("success")
			done();
		}).catch(function(err){
			done(err);
		})
	})

	it("should be able to get volume", function(done){
		httpGet(piAddress, "getVol").then(function(res){
			var vol = parseInt(res);
			assert.isBelow(vol, 101);
			assert.isAtLeast(vol, 0);
			done();
		}).catch(function(err){
			done(err);
		})
	})

	it("should be able to get signiture", function(done){
		httpGet(piAddress).then(function(res){
			expect(res).to.equal(sig)
			done();
		}).catch(function(err){
			done(err);
		})
	})

	it("should be able to get current OS", function(done){
		httpGet(piAddress, "currentOS").then(function(res){
			expect(res).to.equal("raspbian");
			done();
		}).catch(function(err){
			done(err)
		})
	})

	it("should be able to get the os and volume from the server", function(done){
		httpGet(piAddress, "osAndVolume").then(function(res){
			var data = querystring.parse(res)
			var volume = parseInt(data.volume);
			var os = data.os;
			assert.isBelow(volume, 101);
			assert.isAtLeast(volume, 0);
			expect(osList).to.include(os);
			done();
		}).catch(function(e){
			done(e);
		})
	})

	it("should be able to turn the volume up", function(done){
		httpGet(piAddress, "getVol").then(function(res){
			var expected;
			var vol = parseInt(res);
			if(vol > 95)
				expected = 100;
			else
				expected = vol + 5;
			httpPost(piAddress, "volumeup").then(function(data){
				assert.equal(parseInt(data), expected)
				done();
			}).catch(function(e){
				done(e);
			})
		}).catch(function(err){
			done(err);
		})

	});

	it("should be able to turn the volume down", function(done){
		httpGet(piAddress, "getVol").then(function(res){
			var expected;
			var vol = parseInt(res);
			if(vol < 5)
				expected = 0;
			else
				expected = vol - 5;
			httpPost(piAddress, "volumedown").then(function(data){
				assert.equal(parseInt(data), expected)
				done();
			}).catch(function(e){
				done(e);
			})
		}).catch(function(err){
			done(err);
		})
	});

	it("should boot to retropie for the next test", function(done){
		httpPost(piAddress, "switchOS", {osName: "retropie"}).then(function(data){
			console.log("switching to retropie so the following tests can be performed. Please wait 40 seconds")
			setTimeout(done, 40000);
		}).catch(function(err){
			done(err);
		})
	}).timeout(45000);
})

describe("retropie tests", function(){
	this.timeout(5000)

	var piAddress
	before(function(done){
		getAddr().then(function(data){
			piAddress = data
			done();
		}).catch(function(err){
			done(err);
		})
	})

	it("should reboot the raspberry pi", function(done){
		httpPost(piAddress, "reboot", {test: true}).then(function(data){
			expect(data).to.equal("success")
			done();
		}).catch(function(err){
			done(err);
		})
	})

	it("should boot to rca", function(done){
		httpPost(piAddress, "rca", {test: true}).then(function(data){
			expect(data).to.equal("success")
			done();
		}).catch(function(err){
			done(err);
		})
	})
	it("should boot to hdmi", function(done){
		httpPost(piAddress, "hdmi", {test: true}).then(function(data){
			expect(data).to.equal("success")
			done();
		}).catch(function(err){
			done(err);
		})
	})

	it("should be able to get volume", function(done){
		httpGet(piAddress, "getVol").then(function(res){
			var vol = parseInt(res);
			assert.isBelow(vol, 101);
			assert.isAtLeast(vol, 0);
			done();
		}).catch(function(err){
			done(err);
		})
	})

	it("should be able to get signiture", function(done){
		httpGet(piAddress).then(function(res){
			expect(res).to.equal(sig)
			done();
		}).catch(function(err){
			done(err);
		})
	})

	it("should be able to get current OS", function(done){
		httpGet(piAddress, "currentOS").then(function(res){
			expect(res).to.equal("retropie");
			done();
		}).catch(function(err){
			done(err)
		})
	})

	it("should be able to get the os and volume from the server", function(done){
		httpGet(piAddress, "osAndVolume").then(function(res){
			var data = querystring.parse(res)
			var volume = parseInt(data.volume);
			var os = data.os;
			assert.isBelow(volume, 101);
			assert.isAtLeast(volume, 0);
			expect(osList).to.include(os);
			done();
		}).catch(function(e){
			done(e);
		})
	})

	it("should be able to turn the volume up", function(done){
		httpGet(piAddress, "getVol").then(function(res){
			var expected;
			var vol = parseInt(res);
			if(vol > 95)
				expected = 100;
			else
				expected = vol + 5;
			httpPost(piAddress, "volumeup").then(function(data){
				assert.equal(parseInt(data), expected)
				done();
			}).catch(function(e){
				done(e);
			})
		})

	});

	it("should be able to turn the volume down", function(done){
		httpGet(piAddress, "getVol").then(function(res){
			var expected;
			var vol = parseInt(res);
			if(vol < 5)
				expected = 0;
			else
				expected = vol - 5;
			httpPost(piAddress, "volumedown").then(function(data){
				assert.equal(parseInt(data), expected)
				done();
			}).catch(function(e){
				done(e);
			})
		})
	});

	it("should boot to kodi for the next test", function(done){
		httpPost(piAddress, "switchOS", {osName: "kodi"}).then(function(data){
			console.log("switching to kodi to perform the following tests. Please wait 37 seconds")
			setTimeout(done, 37000)
		}).catch(function(err){
			done(err);
		})
	}).timeout(42000);
})

describe("kodi tests", function(){
	this.timeout(5000)

	var piAddress;

	before(function(done){
		getAddr().then(function(data){
			piAddress = data
			done();
		}).catch(function(err){
			done(err);
		})
	})

	it("should reboot the raspberry pi", function(done){
		httpPost(piAddress, "reboot", {test: true}).then(function(data){
			expect(data).to.equal("success")
			done();
		}).catch(function(err){
			done(err);
		})
	})

	it("should boot to rca", function(done){
		httpPost(piAddress, "rca", {test: true}).then(function(data){
			expect(data).to.equal("success")
			done();
		}).catch(function(err){
			done(err);
		})
	})
	it("should boot to hdmi", function(done){
		httpPost(piAddress, "hdmi", {test: true}).then(function(data){
			expect(data).to.equal("success")
			done();
		}).catch(function(err){
			done(err);
		})
	})

	it("should be able to get volume", function(done){
		httpGet(piAddress, "getVol").then(function(res){
			var vol = parseInt(res);
			assert.isBelow(vol, 101);
			assert.isAtLeast(vol, 0);
			done();
		}).catch(function(err){
			done(err);
		})
	})

	it("should be able to get signiture", function(done){
		httpGet(piAddress).then(function(res){
			expect(res).to.equal(sig)
			done();
		}).catch(function(err){
			done(err);
		})
	})

	it("should be able to get current OS", function(done){
		httpGet(piAddress, "currentOS").then(function(res){
			expect(res).to.equal("kodi");
			done();
		}).catch(function(err){
			done(err)
		})
	})

	it("should be able to get the os and volume from the server", function(done){
		httpGet(piAddress, "osAndVolume").then(function(res){
			var data = querystring.parse(res)
			var volume = parseInt(data.volume);
			var os = data.os;
			assert.isBelow(volume, 101);
			assert.isAtLeast(volume, 0);
			expect(osList).to.include(os);
			done();
		}).catch(function(e){
			done(e);
		})
	})

	it("should be able to turn the volume up", function(done){
		httpGet(piAddress, "getVol").then(function(res){
			var expected;
			var vol = parseInt(res);
			if(vol > 97)
				expected = 100;
			else
				expected = vol + 3;
			httpPost(piAddress, "volumeup").then(function(data){
				assert.equal(parseInt(data), expected)
				done();
			}).catch(function(e){
				done(e);
			})
		})

	});

	it("should be able to turn the volume down", function(done){
		httpGet(piAddress, "getVol").then(function(res){
			var expected;
			var vol = parseInt(res);
			if(vol < 3)
				expected = 0;
			else
				expected = vol - 3;
			httpPost(piAddress, "volumedown").then(function(data){
				assert.equal(parseInt(data), expected)
				done();
			}).catch(function(e){
				done(e);
			})
		})
	});

	it("should switch to rasplex for the next test", function(done){
		httpPost(piAddress, "switchOS", {osName: "rasplex"}).then(function(data){
			console.log("switching to rasplex to perform the following tests. Please wait 30 seconds")
			setTimeout(done, 30000)
		}).catch(function(err){
			done(err);
		})
	}).timeout(35000);
})

describe("rasplex tests", function(){
	this.timeout(5000)

	var piAddress
	before(function(done){
		getAddr().then(function(data){
			piAddress = data
			done();
		}).catch(function(err){
			done(err);
		})
	})

	it("should reboot the raspberry pi", function(done){
		httpPost(piAddress, "reboot", {test: true}).then(function(data){
			expect(data).to.equal("success")
			done();
		}).catch(function(err){
			done(err);
		})
	})

	it("should boot to rca", function(done){
		httpPost(piAddress, "rca", {test: true}).then(function(data){
			expect(data).to.equal("success")
			done();
		}).catch(function(err){
			done(err);
		})
	})
	it("should boot to hdmi", function(done){
		httpPost(piAddress, "hdmi", {test: true}).then(function(data){
			expect(data).to.equal("success")
			done();
		}).catch(function(err){
			done(err);
		})
	})

	it("should be able to get volume", function(done){
		httpGet(piAddress, "getVol").then(function(data){
			var vol = parseInt(data);
			assert.isBelow(vol, 101);
			assert.isAtLeast(vol, 0);
			done();
		}).catch(function(err){
			done(err);
		})
	})

	it("should be able to get signiture", function(done){
		httpGet(piAddress).then(function(res){
			expect(res).to.equal(sig)
			done();
		}).catch(function(err){
			done(err);
		})
	})

	it("should be able to get current OS", function(done){
		httpGet(piAddress, "currentOS").then(function(res){
			expect(res).to.equal("rasplex");
			done();
		}).catch(function(err){
			done(err)
		})
	})

	it("should be able to get the os and volume from the server", function(done){
		httpGet(piAddress, "osAndVolume").then(function(res){
			var data = querystring.parse(res)
			var volume = parseInt(data.volume);
			var os = data.os;
			assert.isBelow(volume, 101);
			assert.isAtLeast(volume, 0);
			expect(osList).to.include(os);
			done();
		}).catch(function(e){
			done(e);
		})
	})

	it("should be able to turn the volume up", function(done){
		httpGet(piAddress, "getVol").then(function(res){
			var expected;
			var vol = parseInt(res);
			if(vol > 95)
				expected = 100;
			else
				expected = vol + 5;
			httpPost(piAddress, "volumeup").then(function(data){
				assert.equal(parseInt(data), expected)
				done();
			}).catch(function(e){
				done(e);
			})
		})

	});

	it("should be able to turn the volume down", function(done){
		httpGet(piAddress, "getVol").then(function(res){
			var expected;
			var vol = parseInt(res);
			if(vol < 5)
				expected = 0;
			else
				expected = vol - 5;
			httpPost(piAddress, "volumedown").then(function(data){
				assert.equal(parseInt(data), expected)
				done();
			}).catch(function(e){
				done(e);
			})
		})
	});

	it("should be able to boot back to raspbian because thats where we started", function(done){
		httpPost(piAddress, "switchOS", {osName: "raspbian"}).then(function(data){
			console.log("switching back to raspbian. Please wait 32 seconds")
			setTimeout(done, 32000);
		}).catch(function(err){
			done(err)
		})
	}).timeout(37000)

	it("should make sure that it actually switch to raspbian", function(done){
		httpGet(piAddress, "currentOS").then(function(data){
			expect(data).to.equal("raspbian")
			done();
		}).catch(function(err){
			done(err)
		})
	})
})