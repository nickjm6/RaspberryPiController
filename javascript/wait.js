$(document).ready(function(){
	var count = 0

	$.get("/count", function(data){
		setCount(data)
	})

	$("#changeAddress").click(function(){
		window.location.replace("/html/changeAddress.html")
	})

	function setCount(val){
		count = parseInt(val)
		i = 0
		while(i < 800000000){
			i += 1
		}
		if(count > 20){
			$.get("/resetCount")
			window.location.replace("/html/serverDown.html")
		}
		else{
			$.get("/piAddress", function(data){
				$.get(data, function(){
					window.location.replace("/html/piController.html")
				})
				.fail(function(){
					i = 0
					while(i < 200000000){
						i++
					}
					$.get("/increment")
					window.location.reload()
				})
			})
		}
	}
})
