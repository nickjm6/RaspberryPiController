//import necessary dependancies
var express = require('express');
var execSync = require("child_process").execSync;
var app = express();
var bodyParser = require('body-parser');
var http = require("http");
var ping = require("ping");
var querystring = require("querystring");
var mongoose = require("mongoose")
var cookieParser = require("cookie-parser")
var session = require("express-session")
var passport = require("passport")

var User = require("./config/user.js")
var config = require("./config/config.js")

//set piAddress to empty string, set portNumber to 80, set count to 1
var piAddress;
var portNumber = 80
var addresses = []
var sig = "MyRazPi";
var mongoDB = "mongodb://localhost/test"

mongoose.connect(mongoDB, {
	useMongoClient: true
});
var db = mongoose.connection

db.on("error", console.error.bind(console, "Could not connect to DB"));

require("./config/passport")(passport)

for(var i = 2; i < 256; i++){
	addresses.push("192.168.0." + i);
}

var formRequest = function(addr, path = ""){
	return "http://" + addr + "/" + path;
}

var formPost = function(path, args){
	var res = {
		hostname: piAddress,
		port: 80,
		path: path,
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			"Content-Length": Buffer.byteLength(args)
		}
	}
	return res;
}

var httpPost = function(path, args){
	return new Promise(function(resolve, reject){
		var params = querystring.stringify(args);
		var request = formPost(path, params);

		var req = http.request(request, function(res){
			var statusCode = res.statusCode
			let data = "";
			res.on("data", function(d){
				data += d;
			})
			res.on("end", function(){
				var err = {
					err: data,
					status: statusCode
				};
				if(statusCode == 200)
					resolve(data)
				else
					reject(err)
			})
		})
		req.on("error", function(err){
			getAddr().then(function(){
				reject("Pi Address was wrong, but I just recieved it again. Please try request again", 503)
			}).catch(function(e){
				var err = {
					err: e.message,
					status: parseInt(req.statusCode)
				};
				reject(err);
			});
		})
		req.write(params)
		req.end();
	});
}

var httpGet = function(path){
	return new Promise(function(resolve, reject){
		var statusCode;
		http.get(path, function(res){
			statusCode = res.statusCode
			let rawData = "";
			res.on("data", function(d){
				rawData += d;
			});
			res.on("end", function(){
				try{
					resolve(rawData)
				}catch (e){
					resolve(rawData)
				}
				
			})
		}).on("error", function(e){
			var err = {
				err: e.message, 
				status: parseInt(statusCode)
			};
			reject(err);
		})
	})
}

var getAddr = function(){
	return new Promise(function(resolve, reject){
	    addresses.forEach(function(host){
	        ping.sys.probe(host, function(isAlive){
	            if(isAlive){
	            	httpGet(formRequest(host)).then(function(res){
	            		if(res === sig){
	            			piAddress = host;
	            			resolve(host);
	            		}
	            	}).catch(function(e){
	            	});
	            }
	        });
	    });
	    setTimeout(reject, 2500)
	});
}

var createUser = function(username, password){
	var newUser = new User({
		username: username,
		password: password
	});
	newUser.save(function(err){
		if(err){
			console.log(err);
		} else{
			console.log("save successful");
		}
	})
}

//set up app in current directory
app.use(express.static(__dirname));
app.use(cookieParser());
app.use(session({
	secret: sig
}));
app.use(passport.initialize());
app.use(passport.session())
app.use(bodyParser.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded

//gets the piAddress
app.get("/piAddress", function(req, res){
	getAddr().then(function(d){
		res.send(d)
	}).catch(function(){
		res.status(503).send("could not find raspberry pi");
	})
})

app.get("/currentOS", function(req, res){
	httpGet(formRequest(piAddress, "currentOS")).then(function(data){
		res.send(data);
	}).catch(function(e){
		res.status(e.status).send(e.err);
	})
})

app.get("/getVol", function(req, res){
	httpGet(formRequest(piAddress, "getVol")).then(function(data){
		res.send(data);
	}).catch(function(e){
		res.status(e.status).send(e.err);
	})
})

app.get("/piInfo", function(req, res){
	getAddr().then(function(d){
		httpGet(formRequest(piAddress, "osAndVolume")).then(function(data){
			var result = querystring.parse(data);
			console.log(result)
			result.piAddress = piAddress
			console.log(result)
			res.send(result);
		}).catch(function(e){
			res.status(e.status).send(e.err);
		})
	}).catch(function(err){
		res.status(503).send("could not find raspberry pi");
	})
});

app.get("/", function(req, res){
	res.sendFile(__dirname + "/html/index.html");
})

app.get("/login", function(req, res){
	res.sendFile(__dirname + "/html/login.html");
})

app.get("/piController", function(req, res){
	if(req.isAuthenticated()){
		res.sendFile(__dirname + "/html/piController.html")
	} else{
		res.redirect("/login")
	}
})

app.get("/pokemon", function(req, res){
	res.sendFile(__dirname + "/html/pokemon.html")
})

app.post("/reboot", function(req, res){
	if(req.isAuthenticated()){
		httpPost("/reboot").then(function(data){
			res.send(data)
		}).catch(function(e){
			res.status(e.status).send(e.err)
		})
	} else{
		res.status(403).send("You are not a valid user. Please log in as a valid user")
	}
	
});

app.post("/reboot-token", passport.authenticate("google-id-token"), function(req, res){
	httpPost("/reboot").then(function(data){
		res.send(data);
	}).catch(function(e){
		res.status(e.status).send(e.err);
	})
});

app.post("/switchOS", function(req, res){
	if(req.isAuthenticated()){
		res.setHeader('Access-Control-Allow-Origin','*');
		osName = req.body.osName
		httpPost("/switchOS", {osName: osName}).then(function(data){
			res.send(data);
		}).catch(function(e){
			res.status(e.status).send(e.err);
		})
	} else{
		res.status(403).send("You are not a valid user. Please log in as a valid user")
	}
});

app.post("/switchOS-token", passport.authenticate("google-id-token"), function(req, res){
	res.setHeader("Access-Control-Allow-Origin", "*");
	osName = req.body.osName
	httpPost("/switchOS", {osName: osName}).then(function(data){
		res.send(data);
	}).catch(function(e){
		res.status(e.status).send(e.err);
	})
});

app.post("/rca", function(req, res){
	if(req.isAuthenticated()){
		httpPost("/rca").then(function(data){
			res.send(data);
		}).catch(function(e){
			res.status(e.status).send(e.err);
		})
	} else{
		res.status(403).send("You are not a valid user. Please log in as a valid user");
	}
})

app.post("/rca-token", passport.authenticate("google-id-token"), function(req, res){
	httpPost("/rca").then(function(data){
		res.send(data);
	}).catch(function(e){
		res.status(e.status).send(e.err);
	})
});

app.post("/hdmi", function(req, res){
	if(req.isAuthenticated()){
		httpPost("/hdmi").then(function(data){
			res.send(data);
		}).catch(function(e){;
			res.status(e.status).send(e.err);
		})
	} else{
		res.status(403).send("You are not a valid user. Please log in as a valid user");
	}
})

app.post("/hdmi-token", passport.authenticate("google-id-token"), function(req, res){
	httpPost("/hdmi").then(function(data){
		res.send(data);
	}).catch(function(e){
		res.status(e.status).send(e.err);
	})
});

app.post("/volumeUp", function(req, res){
	if(req.isAuthenticated()){
		httpPost("/volumeup").then(function(data){
			res.send(data);
		}).catch(function(e){
			res.status(e.status).send(e.err);
		})
	} else{
		res.status(403).send("You are not a valid user. Please log in as a valid user");
	}
});

app.post("/volumeup-token", passport.authenticate("google-id-token"), function(req, res){
	httpPost("/volumeup").then(function(data){
		res.send(data);
	}).catch(function(e){
		res.status(e.status).send(e.err);
	})
});

app.post("/volumeDown", function(req, res){
	if(req.isAuthenticated()){
		httpPost("/volumedown").then(function(data){
			res.send(data);
		}).catch(function(e){
			res.status(e.status).send(e.err);
		})
	} else{
		res.status(403).send("You are not a valid user. Please log in as a valid user");
	}
	
})

app.post("/volumedown-token", passport.authenticate("google-id-token"), function(req, res){
	httpPost("/volumedown").then(function(data){
		res.send(data);
	}).catch(function(e){
		res.status(e.status).send(e.err);
	})
});


//queries a pokemon
app.get("/pokemon", function(req, res){
	pokeName = req.query.pokemon
	pokeName = pokeName.replace("+", " ")
	command = "python scripts/pokemon.py scripts/pokemon.txt " + "'" + pokeName + "'"
	result = execSync(command)
	res.send(result)
})

app.get("/logout", function(req, res){
	req.logout();
	res.redirect("/")
})

app.get("/auth/google", passport.authenticate("google", {
	scope: ['profile', 'email']
}));

app.post("/auth/google", passport.authenticate("google-id-token"), function(req, res){
	res.send(req.user)
});

app.get("/auth/google/callback",
	passport.authenticate("google", {
		successRedirect: "/piController",
		failureRedirect: "/login"
	})),

function isLoggedIn(req, res, next){
	if(req.isAuthenticated())
		return next();
	res.status(403).send("not logged in")
}

// gets address before starting the server
getAddr().then(function(){
	//sets up server on localhost with port corresponding to portNumber
	var server = app.listen(portNumber, function () {
  		console.log("Server started");
	});

}).catch(function(){
	console.log("Could not find pi Address, but will start server anyways")
	var server = app.listen(portNumber, function(){
		console.log("Server started")
	})
})


