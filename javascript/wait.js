$(document).ready(function(){
	var count = 0

	$.get("/count", function(data){
		setCount(data)
	})

	function setCount(val){
		count = parseInt(val)
		if(count > 5){
			$.get("/resetCount")
			window.location.replace("/html/serverDown.html")
		}
		else{
			$.get("192.168.0.x:9876", function(){
				window.location.replace("/html/piController.html")
			})
			.fail(function(){
				i = 0 
				while(i < 400000000)
					i++
				$.get('/increment')
				window.location.reload()
			})
		}
	}
})