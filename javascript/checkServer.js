$(document).ready(function(){
	$.get("http://192.168.2.73:9876", function(){
		window.location.replace("/html/piController.html")
	})
	$("#home").click(function(){
		window.location.replace("/index.html")
	})
	$("#tryAgain").click(function(){
		window.location.reload()
	})
})
