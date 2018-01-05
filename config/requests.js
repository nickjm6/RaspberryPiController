var http = require("http")
var querystring = require("querystring");

var formPost =  function(path, args, addr){
var res = {
		hostname: addr,
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


module.exports = {
	post: function(path, args, addr){
		return new Promise(function(resolve, reject){
			var params = querystring.stringify(args);
			var request = formPost(path, params, addr);
			var statusCode;

			var req = http.request(request, function(res){
				statusCode = res.statusCode
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
			req.on("error", function(e){
				var err = {
					err: e.message, 
					status: parseInt(statusCode)
				};
				reject(err);
			})
			req.write(params)
			req.end();
		});
	},

	get: function(path){
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
	},

	formRequest:function(addr, path = ""){
		return "http://" + addr + "/" + path;
	}
};