var chai = require("chai");
var assert = chai.assert;
var expect = chai.expect;

var querystring = require("querystring");

var requests = require("../config/requests");
var getAddr = require("../config/getAddr")
var formRequest = requests.formRequest;
var httpGet = requests.get;
var httpPost = requests.post;

var regIP = new RegExp("^192\.168\.[0-2]\.[0-9]{1,2}$");


var sig = "MyRazPi";
var osList = ["raspbian", "rasplex", "retropie", "kodi"];

describe("Server tests", function(){
	describe("Request tests", function(){
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

		this.timeout(3000);

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

	describe.skip("Post requests session to server", function(){
		it("should be able to reboot the raspberry pi from the server", function(done){
			httpPost("myrazpi.com", "reboot", {test: true}).then(function(data){
				done();
			}).catch(function(err){
				done(err);
			})
		});

		it("should be able to switch to raspbian from the server", function(done){
			httpPost("myrazpi.com", "switchOS", {osName: "raspbian", test: true}).then(function(data){
				done();
			}).catch(function(err){
				done(err);
			})
		});

		it("should be able to switch to raspbian from the server", function(done){
			httpPost("myrazpi.com", "switchOS", {osName: "raspbian", test: true}).then(function(data){
				done();
			}).catch(function(err){
				done(err);
			})
		});


		it("should be able to switch to raspbian from the server", function(done){
			httpPost("myrazpi.com", "switchOS", {osName: "raspbian", test: true}).then(function(data){
				done();
			}).catch(function(err){
				done(err);
			})
		});


		it("should be able to switch to raspbian from the server", function(done){
			httpPost("myrazpi.com", "switchOS", {osName: "raspbian", test: true}).then(function(data){
				done();
			}).catch(function(err){
				done(err);
			})
		});

		it("should be able to boot to rca from the server", function(done){
			httpPost("myrazpi.com", "rca", {test: true}).then(function(data){
				done();
			}).catch(function(err){
				done(err);
			})
		});

		it("should be able to boot to hdmi from the server", function(done){
			httpPost("myrazpi.com", "hdmi", {test: true}).then(function(data){
				done();
			}).catch(function(err){
				done(err);
			})
		});

		it("should be able to turn the volume up from the server", function(done){
			httpPost("myrazpi.com", "volumeup").then(function(data){
				done();
			}).catch(function(err){
				done(err);
			})
		});

		it("should be able to turn the volume down from the server", function(done){
			httpPost("myrazpi.com", "volumedown").then(function(data){
				done();
			}).catch(function(err){
				done(err);
			})
		});
	})

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

});

describe.skip("raspbian tests", function(){
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
		httpGet(piAddress, "currentOS", function(res){
			expect(res).to.equal("raspbian");
			done();
		}).catch(function(err){
			done(err)
		})
	})

	it("should be able to get the os and volume from the server", function(done){
		requests.getJSON(piAddress, "osAndVolume").then(function(res){
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
})

describe.skip("retropie tests", function(){
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
		httpGet(piAddress, "currentOS", function(res){
			expect(res).to.equal("retropie");
			done();
		}).catch(function(err){
			done(err)
		})
	})

	it("should be able to get the os and volume from the server", function(done){
		requests.getJSON(piAddress, "osAndVolume").then(function(res){
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
})

describe.skip("kodi tests", function(){
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
		httpGet(piAddress, "currentOS", function(res){
			expect(res).to.equal("kodi");
			done();
		}).catch(function(err){
			done(err)
		})
	})

	it("should be able to get the os and volume from the server", function(done){
		requests.getJSON(piAddress, "osAndVolume").then(function(res){
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

	it.skip("should boot to rca", function(done){
		httpPost(piAddress, "rca", {test: true}).then(function(data){
			expect(data).to.equal("success")
			done();
		}).catch(function(err){
			done(err);
		})
	})
	it.skip("should boot to hdmi", function(done){
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

	it.skip("should be able to get the os and volume from the server", function(done){
		requests.getJSON(piAddress, "osAndVolume").then(function(res){
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
})