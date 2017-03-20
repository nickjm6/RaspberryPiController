$(document).ready(function(){
	var piAddress = ""
	$.get("/piAddress", function(data){
		$.get(data, function(){
			window.location.replace("/html/piController.html")
		})
	})
	.fail(function(){
		alert("Sorry, an error occured")
	})
	$("#home").click(function(){
		window.location.replace("/index.html")
	})
	$("#tryAgain").click(function(){
		window.location.reload()
	})

	$("#changeAddress").click(function(){
		window.location.replace("/html/changeAddress.html")
	})
})
