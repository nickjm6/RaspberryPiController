var Client = require("node-rest-client").Client;
var client = new Client();

module.exports = {
	post: function(addr, method, args={}){
		var path = "http://" + addr + "/" + method;
		return new Promise(function(resolve, reject){
			client.post(path, args, function(data, response){
				resolve(data.toString());
			}).on("error", function(err){
				reject(err)
			})
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