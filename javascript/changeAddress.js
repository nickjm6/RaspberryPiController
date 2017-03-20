$(document).ready(function(){
	$.get("/piAddress", function(data){
		ipAndPort = data.split("//")[1]
		ip = ipAndPort.split(":")[0]
		port = ipAndPort.split(":")[1]
		$("#newAddress").val(ip)
		$("#newPort").val(port)
	})

	$("#submit").click(function(){
		newIP = $("#newAddress").val()
		newPort = $("#newPort").val()
		newAddress = "http://" + newIP + ":" + newPort
		$.post("/changeAddress", {"address":newAddress}, function(){
			window.location.replace("/html/piController.html")
		})
		.fail(function(){
			window.location.replace("/html/piController.html")
		})
	})
})