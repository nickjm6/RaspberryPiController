function getOS(){
	$.get("/currentOS", function(data){
		setOS(data)
	});
}

function setOS(osName){
	capName = osName[0].toUpperCase() + osName.substring(1)
	$("#currentOS").text(capName)
	picName = "images/" + osName + ".png"
	$("#currentOSPic").attr("src", picName)
}
getOS()