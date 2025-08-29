

function openStatsScreen() {
	document.getElementById("statsScreen").style.left = "0"
	document.getElementById("toolScreen").style.left = "100%"
	document.getElementById("upgradeScreen").style.left = "-100%"
	document.getElementById("totalOresMined").innerHTML = format(game.totalOresMined)
	if (game.numberFormat == "standard") {document.getElementById("numberFormat").innerHTML = "Standard"}
	else if (game.numberFormat == "standardLong") {document.getElementById("numberFormat").innerHTML = "Standard long"}
	else {document.getElementById("numberFormat").innerHTML = "Scientific"}
}

function closeStatsScreen() {
	document.getElementById("statsScreen").style.left = "-100%"
}