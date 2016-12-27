var serverAddress = "http://68.9.120.198:1234"

function updateServer(){
	address = "%s/update", serverAddress
	$.get(address, function(data){

	})
}

function rebootServer(){
	address = "%s/reboot", serverAddress
	// $.get(address, function(data){

	// })
}

function switchOS(){
	newOS = $("#os").val()
	setOS(newOS.toLowerCase())
	address = "%s/switchOS", serverAddress
	$.get(address, function(data){
		
	})
}