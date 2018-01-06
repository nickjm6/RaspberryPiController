var httpGet = require("./requests").get;
var ping = require("ping");

var addresses = []
var sig = "MyRazPi";

for(var i = 2; i < 256; i++){
	addresses.push("192.168.0." + i);
}


module.exports = function(){
	return new Promise(function(resolve, reject){
	    addresses.forEach(function(host){
	        ping.sys.probe(host, function(isAlive){
	            if(isAlive){
	            	httpGet(host).then(function(res){
	            		if(res === sig){
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