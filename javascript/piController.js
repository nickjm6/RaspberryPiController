$(document).ready(function(){
	var method = undefined
	var currentOS = undefined

	function getOS(){
		$.get("/currentOS", function(data){
			setOS(data)
		});
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
				$.post("/reboot",{"password": password})
				break;
			case "update":
				$.post("/update", {"password": password})
				break;
			case "switch":
				newOS = $("#os").val()
				setOS(newOS.toLowerCase())
				$.post("/switchOS", {"password": password, "osName": currentOS})
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



