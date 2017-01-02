jQuery.getCORS = function(url, data, func){ 
	if(func == undefined) 
		func = function(){}; 
	return $.ajax({ 
		type: 'GET', 
		url: url, 
		crossDomain: true,
		data: data, 
		dataType: 'text', 
		contentType: 'application/x-www-form-urlencoded', 
		xhrFields: { 
			withCredentials: true 
		}, 
		success: function(res) { 
			func(res)
		}, 
		error: function() { 
			func({}) 
		}
	}); 
}

jQuery.postCORS = function(url, data, func){ 
	if(func == undefined) 
		func = function(){}; 
	return $.ajax({ 
		type: 'POST', 
		url: url, 
		crossDomain: true,
		data: data, 
		dataType: 'json', 
		contentType: 'application/x-www-form-urlencoded', 
		xhrFields: { 
			withCredentials: true 
		}, 
		success: function(res) { 
			func(res) 
		}, 
		error: function() { 
			func({}) 
		}
	}); 
}