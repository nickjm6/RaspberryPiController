$(document).ready(function(){
	$.get("192.168.0.x:9876", function(){
		window.location.replace("/html/piController.html")
	})
	$("#home").click(function(){
		window.location.replace("/index.html")
	})
	$("#tryAgain").click(function(){
		window.location.reload()
	})
})