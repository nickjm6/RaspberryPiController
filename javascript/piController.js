$(document).ready(function(){
	var method = undefined
	var currentOS = undefined
	var address = "http://192.168.2.73:9876"
	var oses = ['kodi', 'raspbian', 'rasplex', 'retropie']
	getOS()

	function getOS(){
		httpAddress = address + "/currentOS"
		$.get(httpAddress, function(data){
			if(data == "kodi" || data == "raspbian" || data == "rasplex" || data == "retropie")
				setOS(data)
		})
		.fail(function(){
			window.location.replace("/html/serverDown.html");
		})
	}

	function setOS(osName){
		$("#update").prop('disabled', false)
		capName = osName[0].toUpperCase() + osName.substring(1)
		currentOS = osName
		if (osName == "rasplex")
			$("#update").prop('disabled', true)
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
		$("#update").prop("disabled", true)
	}

	function enableButtons(){
		$("#reboot").prop("disabled", false)
		$("#switch").prop("disabled", false)
		$("#update").prop("disabled", false)
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

	$("#update").click(function(){
		httpAddress = address + "/update"
		notifyMessage("updating OS...please wait until the system finishes updating to run any other commands", "info")
		disableButtons()
		$.post(httpAddress, function(data){
			enableButtons()
			notifyMessage(data, "success")
		})
		.fail(function(){
			enableButtons()
			notifyMessage("Update Failed. you may now perform other functions though!", "danger")
		})

	})

	$("#reboot").click(function(){
		httpAddress = address + "/reboot"
		$.post(httpAddress, function(data){
			window.location.replace("/html/reboot.html")
		})
		.fail(function(){
			notifyMessage("Error connecting to server. Try refreshing page, or just try again", "danger")
		})
	})

	$("#switch").click(function(){
		httpAddress = address + "/switchOS"
		$.post(httpAddress, {"osName": $("#os").val()}, function(data){
			window.location.replace("/html/switch.html")
		})
		.fail(function(){
			notifyMessage("Error connecting to server. Try refreshing page, or just try again", "danger")
		})
	})

	$("#rca").click(function(){
		httpAddress = address + "/rca"
		$.post(httpAddress, function(data){
			window.location.replace("/html/reboot.html")
		})
		.fail(function(){
			notifyMessage("Error connecting to server. Try refreshing page, or just try again", "danger")
		})
	})

	$("#hdmi").click(function(){
		httpAddress = address + "/hdmi"
		$.post(httpAddress, function(data){
			window.location.replace("/html/reboot.html")
		})
		.fail(function(){
			notifyMessage("Error connecting to server. Try refreshing page, or just try again", "danger")
		})
	})
});



