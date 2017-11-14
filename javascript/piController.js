$(document).ready(function(){
	var method = undefined
	var oses = ["...", 'Kodi', 'Raspbian', 'Rasplex', 'Retropie']

	function arrayRemove(arr, item){
		var newArr = [];
		for(i in arr){
			if(arr[i] != item)
				newArr.push(arr[i])
		}
		return newArr;
	}

	var vm = {
		currentOS: ko.observable("???"),
		piAddress: ko.observable(),
		selectedOS: ko.observable(),
		osList: ko.observableArray(oses),
		picName: ko.observable("/images/question.png")
	}

	vm.currentOS.subscribe(function(data){
		vm.osList(arrayRemove(oses, data))
		var lowerOS = data.toLowerCase();
		vm.picName("/images/" + lowerOS + ".png");
	})

	$.get("/piAddress", function(data){
		vm.piAddress(data);
	}).fail(function(){
		vm.piAddress("PI Unavailable")
	})

	$.get("/currentOS", function(data){
		var capName = data[0].toUpperCase() + data.substring(1);
		vm.currentOS(capName);
	})

	$("#reboot").click(function(){
		$.post("/reboot", function(data){
			alert(data)
		}).fail(function(err){
			alert(err.statusText)
		})
	})

	$("#switch").click(function(){
		if(vm.selectedOS() === "..."){
			alert("please select an OS to switch to")
		} else{
			$.post("/switchOS", {osName: vm.selectedOS()}, function(data){
				alert(data)
			}).fail(function(err){
				alert(err.statusText)
			})
		}
	})

	$("#rca").click(function(){
		$.post("/rca", function(data){
			alert(data)
		}).fail(function(err){
			alert(err.statusText)
		})
	})
	
	$("#hdmi").click(function(){
		$.post("/hdmi", function(data){
			alert(data)
		}).fail(function(err){
			alert(err)
		})
	})

	// $("#hdmi").click(function(){
	// 	getAddress(function(piAddress){
	// 		httpAddress = piAddress + "/hdmi"
	// 		$.post(httpAddress, function(data){
	// 			window.location.replace("/html/reboot.html")
	// 		})
	// 		.fail(function(){
	// 		})
	// 	})
	// })

	ko.applyBindings(vm);
});



