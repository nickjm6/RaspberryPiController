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
				$.post(httpAddress,{"password": password}, function(data){
					if(data == "successful reboot")
						window.location.replace("/html/reboot.html")
				})
				.fail(function(){
					alert("Could not connect to server")
				})
				break;
			case "update":
				httpAddress = address + "/update"
				$.post(httpAddress, {"password": password}, function(data){
				})
				.fail(function(){
					alert("Could not connect to server")
				})
				break;
			case "switch":
				httpAddress = address + "/switchOS"
				$.post(httpAddress, {"password": password, "osName": $("#os").val()}, function(data){
					if(data == "switching os"){
						window.location.replace("/html/switch.html")
					}
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
});



