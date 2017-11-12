$(document).ready(function(){
	var method = undefined
	var currentOS = undefined
	var piAddress;
	var oses = ['kodi', 'raspbian', 'rasplex', 'retropie']
	getOS()

	function getAddress(){
		return new Promise(function(resolve, reject){
			$.get("/piAddress", function(data){
				piAddress = "http://" + data;
				resolve(data)
			}).fail(function(err){
				reject(err);
			})
		})
	}

	var getReq = function(path){
		return new Promise(function(resolve, reject){
			$.get(piAddress + path, function(data){
				resolve(data)
			}).fail(function(err){
				reject(err);
			})
		})
	}

	var postReq = function(path, params = {}){
		return new Promise(function(resolve, reject){
			$.post(piAddress + path, params, function(data){
				resolve(data)
			}).fail(function(err){
				reject(err)
			})
		})
	}

	getAddress().then(function(data){
		getOS();
	}).catch(function(err){
		alert(err)
	})

	function setOS(osName){
		capName = osName[0].toUpperCase() + osName.substring(1)
		currentOS = osName
		for(i in oses){
			os = oses[i]
			if(os != osName){
				option = $("<option>" + os[0].toUpperCase() + os.substring(1) + "</option>")
				$("#os").append(option)
			}
		}
		$("#currentOS").text(capName)
		picName = "/images/" + osName + ".png"
		$("#currentOSPic").attr("src", picName)
	}

	function disableButtons(){
		$("#reboot").prop("disabled", true)
		$("#switch").prop("disabled", true)
		$("#rca").prop("disabled", true)
		$("#hdmi").prop("disabled", true)
	}

	function enableButtons(){
		$("#reboot").prop("disabled", false)
		$("#switch").prop("disabled", false)
		$("#rca").prop("disabled", false)
		$("#hdmi").prop("disabled", false)
	}

	function getOS(){
		if(piAddress){
			getReq("/currentOS").then(function(data){
				if(data == "kodi" || data == "raspbian" || data == "rasplex" || data == "retropie")
					setOS(data)
			}).catch(function(e){
				getAddress().then(function(){
					getOS();
				}).catch(function(){
					window.location.replace("/html/serverDown.html");
				})
			})
		} else{
			getAddress().then(function(){
				getOS();
			}).catch(function(err){
				notifyMessage("could not find raspberry pi", "danger");
			})
		}
	}

	var reboot = function(){
		if(piAddress){
			postReq("/reboot").then(function(data){
				window.location.replace("/html/reboot.html");
			}).catch(function(e){
				getAddress.then(function(){
					reboot();
				}).catch(function(e){
					window.location.replace("/html/serverDown.html")
				})
			})
		} else{
			getAddress.then(function(){
				reboot();
			}).catch(function(e){
				window.location.replace("/html/serverDown.html")
			})
		}
	}

	var switchOS = function(){
		if(piAddress){
			postReq("/switchOS", {osName: $("#os").val()}).then(function(data){
				window.location.replace("/html/switch.html")
			}).catch(function(err){
				getAddress().then(function(data){
					switchOS()
				}).catch(function(err){
					window.location.replace("/html/serverDown.html");
				})
			})
		} else{
			getAddress().then(function(data){
				switchOS()
			}).catch(function(err){
				window.location.replace("/html/serverDown.html")
			})
		}
	}

	$("#reboot").click(function(){
		reboot();
	})

	$("#switch").click(function(){
		switchOS()
	})

	$("#rca").click(function(){
		getAddress(function(piAddress){
			httpAddress = piAddress + "/rca"
			$.post(httpAddress, function(data){
				window.location.replace("/html/reboot.html")
			})
			.fail(function(){
			})
		})
	})

	$("#hdmi").click(function(){
		getAddress(function(piAddress){
			httpAddress = piAddress + "/hdmi"
			$.post(httpAddress, function(data){
				window.location.replace("/html/reboot.html")
			})
			.fail(function(){
			})
		})
	})
});



