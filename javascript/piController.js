$(document).ready(function(){
	var method = undefined
	var currentOS = undefined
	var oses = ['kodi', 'raspbian', 'rasplex', 'retropie']
	getOS()

	function getAddress(callback){
		$.get("/piAddress", function(data){
			callback(data)
		})
	}

	function getOS(){
		getAddress(function(piAddress){
			if(piAddress == ""){
				window.location.replace("/html/changeAddress.html")
			}
			else{
				ipAndPort = piAddress.split("//")[1]
				$("#addressLabel").text(ipAndPort)
				httpAddress = piAddress + "/currentOS"
				$.get(httpAddress, function(data){
					if(data == "kodi" || data == "raspbian" || data == "rasplex" || data == "retropie")
						setOS(data)
				})
				.fail(function(){
					window.location.replace("/html/serverDown.html");
				})
			}
		})
	}

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

	function notifyMessage(messageVal, typeVal){
		$.notifyClose()
		$.notify(
			{message: messageVal},
    		{
        		delay: 10000,
        		placement: {
					from: "top",
					align: "center"
        		},
        		type: typeVal
    		}
    	);
	}
	$("#reboot").click(function(){
		getAddress(function(piAddress){
			httpAddress = piAddress + "/reboot"
			$.post(httpAddress, function(data){
				window.location.replace("/html/reboot.html")
			})
			.fail(function(){
				notifyMessage("Error connecting to server. Try refreshing page, or just try again", "danger")
			})
		})
	})

	$("#switch").click(function(){
		getAddress(function(piAddress){
			httpAddress = piAddress + "/switchOS"
			$.post(httpAddress, {"osName": $("#os").val()}, function(data){
				window.location.replace("/html/switch.html")
			})
			.fail(function(){
				notifyMessage("Error connecting to server. Try refreshing page, or just try again", "danger")
			})
		})
	})

	$("#rca").click(function(){
		getAddress(function(piAddress){
			httpAddress = piAddress + "/rca"
			$.post(httpAddress, function(data){
				window.location.replace("/html/reboot.html")
			})
			.fail(function(){
				notifyMessage("Error connecting to server. Try refreshing page, or just try again", "danger")
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
				notifyMessage("Error connecting to server. Try refreshing page, or just try again", "danger")
			})
		})
	})

	$("#changeAddress").click(function(){
		window.location.replace("/html/changeAddress.html")
	})
});



