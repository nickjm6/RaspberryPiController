$(document).ready(function(){
	var method = undefined
	var oses = ["...", 'Kodi', 'Raspbian', 'Rasplex', 'Retropie']

	var attemptCount = 0;

	function delay(d){
		return new Promise(function(resolve, reject){
			setTimeout(resolve, d)
		})
	}

	function arrayRemove(arr, item){
		var newArr = [];
		for(i in arr){
			if(arr[i] != item)
				newArr.push(arr[i])
		}
		return newArr;
	}

	function addAlert(msg, type){
		removeAlerts();
		var newAlert = $("<div class='alert fade in'>" + msg + "</div>");
		newAlert.addClass("alert-" + type);
		$("#alertDiv").append(newAlert);
	}

	function removeAlerts(){
		$(".alert").remove();
	}

	function disableButtons(){
		$("#reboot").attr("disabled", true);
		$("#switch").attr("disabled", true);
		$("#rca").attr("disabled", true);
		$("#hdmi").attr("disabled", true);
	}

	function enableButtons(){
		$("#reboot").attr("disabled", false);
		$("#switch").attr("disabled", false);
		$("#rca").attr("disabled", false);
		$("#hdmi").attr("disabled", false);
	}

	var vm = {
		currentOS: ko.observable("???"),
		piAddress: ko.observable(),
		selectedOS: ko.observable(),
		osList: ko.observableArray(oses),
		picName: ko.observable("/images/question.png"),
	}

	vm.currentOS.subscribe(function(data){
		vm.osList(arrayRemove(oses, data))
		if(data === "???"){
			vm.picName("/images/question.png")
		}
		else{
			var lowerOS = data.toLowerCase();
			vm.picName("/images/" + lowerOS + ".png");
			enableButtons()
			$("body").mLoading("hide")
		}
	})

	var getReq = function(path){
		$.get(path, function(data){
			addAlert(data, "success")
		}).fail(function(err){
			addAlert(err.responseText, "danger")
		})
	}

	var postReq = function(path, message, params={}){
		disableButtons();
		$("body").mLoading({
			text: message
		})
		$.post(path, params, function(data){
			enableButtons();
			vm.piAddress("PI Unavailable")
			vm.currentOS("???")
			delay(10000).then(function(){
				attemptCount = 0;
				recursiveLoad();
			}).catch(function(){})
		}).fail(function(err){
			enableButtons();
			$("body").mLoading("hide");
			addAlert(err.responseText, "danger");
		})
	}

	function getAddress(){
		return new Promise(function(resolve, reject){
			$.get("/piAddress", function(data){
				vm.piAddress(data);
				$.get("/currentOS", function(data1){
					var capName = data1[0].toUpperCase() + data1.substring(1);
					vm.currentOS(capName);
					resolve();
				}).fail(function(err){
					vm.currentOS("???")
					vm.piAddress("PI Unavailable");
					disableButtons();
					reject()
				})
			}).fail(function(err){
				vm.piAddress("PI Unavailable")
				vm.currentOS("???");
				disableButtons();
				reject();
			})
		});
	}

	$.get("/piAddress", function(data){
		vm.piAddress(data);
	}).fail(function(){
		vm.piAddress("PI Unavailable")
	})

	$.get("/currentOS", function(data){
		var capName = data[0].toUpperCase() + data.substring(1);
		vm.currentOS(capName);
	}).fail(function(err){
		addAlert(err.statusText, "danger")
		vm.currentOS("???");
	})

	$("#reboot").click(function(){
		postReq("/reboot", "rebooting, please wait...")
	})

	$("#switch").click(function(){
		if(vm.selectedOS() === "..."){
			addAlert("please select an OS to switch to", "danger")
		} else{
			postReq("/switchOS", 'Switching to ' + vm.selectedOS() + "...", {osName: vm.selectedOS()});
		}
	})

	$("#rca").click(function(){
		postReq("/rca", "Switching to RCA Display");
	})
	
	$("#hdmi").click(function(){
		postReq("/hdmi", "Switching to HDMI Display")
	})

	$(document).click(function(){
		removeAlerts();
	})

	ko.applyBindings(vm);
	disableButtons()
	$("body").mLoading({
		text: "Finding Pi Address..."
	})

	function recursiveLoad(){
		if(attemptCount > 10){
			addAlert("Could not find Raspberry Pi", "danger")
			attemptCount = 0;
			$("body").mLoading("hide")
		}
		getAddress().then(function(){
			$("body").mLoading("hide")
			addAlert("Success!", "success");
		}).catch(function(){
			delay(3000).then(function(){
				attemptCount += 1;
				recursiveLoad();
			}).catch(function(){})
		})
	}

	getAddress().then(function(data){
	}).catch(function(err){
		addAlert(err.statusText, "danger");
		$("body").mLoading("hide")
	});
});



