$(document).ready(function(){
	var method = undefined
	var currentOS = undefined
	var address = "http://192.168.0.x:9876"

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
		capName = osName[0].toUpperCase() + osName.substring(1)
		currentOS = osName
		$("#currentOS").text(capName)
		picName = "/images/" + osName + ".png"
		$("#currentOSPic").attr("src", picName)
	}

	function setMethod(newMethod){
		method = newMethod
	}

	$("#password").keydown(function(event){
		if (event.keyCode == 13){
			$("#submit").click()
		}
	})

	$("#submit").click(function(){
		password = $("#password").val()
		switch(method){
			case "reboot":
				httpAddress = address + "/reboot"
				jqxhr = $.post(httpAddress,{"password": password})
				.fail(function(){
					alert("Could not connect to server")
				})
				break;
			case "update":
				httpAddress = address + "/update"
				jqxhr = $.post(httpAddress, {"password": password})
				.fail(function(){
					alert("Could not connect to server")
				})
				break;
			case "switch":
				httpAddress = address + "/switchOS"
				jqxhr = $.post(httpAddress, {"password": password, "osName": currentOS}, function(){
					newOS = $("#os").val()
					setOS(newOS.toLowerCase())
				})
				.fail(function(){
					alert("Could not connect to server")
				})
				break;
			default:
				alert("You have done fucked up")
				break;
		}
		$("#password").val("")
		$("#value").val("")
	});

	$(".closeButton").click(function(){
		$("#password").val("")
	});

	$("#reboot").click(function(){
		setMethod("reboot");
	})

	$("#update").click(function(){
		setMethod("update");
	})

	$("#switch").click(function(){
		setMethod("switch")
	})

	getOS()
});



