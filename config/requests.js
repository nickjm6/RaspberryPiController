var Client = require("node-rest-client").Client;
var client = new Client();
var http = require("http")
var querystring = require("querystring")

module.exports = {
	post: function(addr, method, data={}){
		return new Promise(function(resolve, reject){
			var postData = querystring.stringify(data)
			var options = {
				hostname: addr,
				port: 80,
				path: "/" + method,
				method: "POST",
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
	   				'Content-Length': Buffer.byteLength(postData)
				}
			}
			var req = http.request(options, function(res){
				res.setEncoding("utf8")
				var response = ""
				res.on("data", function(d){
					response += d
				})
				res.on("end", function(){
					resolve(response)
				})
			})

			req.on("error", function(e){
				reject(e)
			});

			req.write(postData);
			req.end();
		});
	},

	get: function(addr, method=""){
		var path = "http://" + addr + "/" + method;
		return new Promise(function(resolve, reject){
			client.get(path, function(data, response){
				resolve(data.toString())
			}).on("error", function(err){
				reject(err);
			})
		})
	},

	getJSON: function(addr, method=""){
		var path = "http://" + addr + "/" + method;
		return new Promise(function(resolve, reject){
			client.get(path, function(data, response){
				resolve(data)
			}).on("error", function(err){
				reject(err);
			})	
		});
	}
};