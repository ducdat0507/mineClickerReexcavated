

function changeNumberFormat() {
	if (game.numberFormat == "standard") {
		game.numberFormat = "standardLong"
		document.getElementById("numberFormat").innerHTML = "Standard long"
	}
	else if (game.numberFormat == "standardLong") {
		game.numberFormat = "scientific"
		document.getElementById("numberFormat").innerHTML = "Scientific"
	}
	else {
		game.numberFormat = "standard"
		document.getElementById("numberFormat").innerHTML = "Standard"
	}
	loadOre(game.currentOre)
	document.getElementById("cash").innerHTML = "$" + format(game.cash)
}

function enableDisableMessages() {
	game.messages = !game.messages
	document.getElementById("topBarMessages").innerHTML = game.messages ? "On" : "Off"
}
