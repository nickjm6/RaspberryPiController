$(document).ready(function(){
	params = window.location.search.substr(1)
	if (params.length > 0){
		params = params.split("&")
		var pokemon = params[0].split("=")[1]
		if (pokemon.length == 0){
			alert("Please Enter a Pokemon!")
		}
		$.get("/pokemon", {"pokemon":pokemon}, function(data){
			addResults(data, pokemon)
		})
	}
})

function addResults(results, pokemon){
	lines = results.split("\n")
	container = $("<div class='container'></div>")
	jumbotron = $("<div id='pokeInfo' class='jumbotron'></div>")
	if (pokemon == "mr.+mime")
		imgPokemon = 'mr-mime'
	else if(pokemon == "mime+jr.")
		imgPokemon = "mime-jr"
	else
		imgPokemon = pokemon
	container.append(jumbotron)
	if(lines[0] == "Please enter a valid pokemon"){
		message = $("<h2>That is not a valid pokemon!!</h2>")
		jumbotron.append(message)
	}
	else{
		row = $("<div class='row'></div>")
		resultsCol = $("<div class='col-md-8'</div>")
		imgCol = $("<div class='col-md-4'</div>")
		imgCol.append(getPokemonImage(imgPokemon))
		row.append(resultsCol)
		row.append(imgCol)
		for(i in lines){
			line = lines[i]
			if(line.length > 0){
				line = line[0].toUpperCase() + line.substr(1)
				fact = $("<h2>" + line + "</h2>")
				resultsCol.append(fact)
			}
		}
		FilteredPokemon = pokemon.replace("+", "_")
		address = "http://bulbapedia.bulbagarden.net/wiki/"
		address += FilteredPokemon + "_(Pokemon)"
		hyperlink = $("<a href='" + address + "'>Bulbapedia</a>")
		resultsCol.append(hyperlink)
		jumbotron.append(row)
	}
	$('body').append(container)
}

function getPokemonImage(pokemon){
	baseAddress = "https://img.pokemondb.net/artwork/"
	baseAddress += pokemon + ".jpg"
	img = $("<img id='pokeImage' src='" + baseAddress + "'>")
	return img
}