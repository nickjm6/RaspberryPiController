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
		}
	})

	var getReq = function(path){
		$.get(path, function(data){
			addAlert(data, "success")
		}).fail(function(err){
			addAlert(err.statusText, "danger")
		})
	}

	var postReq = function(path, params={}){
		disableButtons();
		$.post(path, params, function(data){
			enableButtons();
			addAlert(data, "success");
		}).fail(function(err){
			enableButtons();
			addAlert(err.statusText, "danger");
		})
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
		postReq("/reboot")
	})

	$("#switch").click(function(){
		if(vm.selectedOS() === "..."){
			addAlert("please select an OS to switch to", "danger")
		} else{
			postReq("/switchOS", {osName: vm.selectedOS()});
		}
	})

	$("#rca").click(function(){
		postReq("/rca");
	})
	
	$("#hdmi").click(function(){
		postReq("/hdmi")
	})

	$(document).click(function(){
		removeAlerts();
	})

	ko.applyBindings(vm);
	disableButtons()
});



