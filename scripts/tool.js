


let currentTool = "tool";

function openToolScreen() {
	document.getElementById("toolScreen").style.left = "0"
	document.getElementById("upgradeScreen").style.left = "-100%"
	document.getElementById("statsScreen").style.left = "-100%"
	loadToolScreenInfo()
}

function getToolDamage(type, x) {
	if (x === undefined) x = getToolLevel(type)

	if (type == "tool") {
		if (x < 33) {
			return toolDamages[x - 1]
		} else {
			return 25 ** (x - 32) * toolDamages[32]
		}
	} else if (type == "comp") {
		if (x <= compDamages.length) {
			return compDamages[x - 1]
		} else {
			return compDamages[compDamages.length - 1] + 50 * (x - compDamages.length)
		}
	}
}

function getToolCost(type, x) {
	if (x === undefined) x = getToolLevel(type)

	if (type == "tool") {
		if (x < 33) {
			return toolCosts[x - 1] * getUpgradeEffect("normal", 8)
		} else {
			return (x * 1000) ** (x - 33) * toolCosts[32] * getUpgradeEffect("normal", 8)
		}
	} else if (type == "comp") {
		if (x <= compCosts.length) {
			return compCosts[x - 1]
		} else {
			return x ** (x - compCosts.length) * compCosts[compCosts.length - 1]
		}
	}
}

function getToolLevel(type) {
	if (type == "tool") {
		return game.currentTool;
	} else if (type == "comp") {
		return game.currentCompanion;
	}
}

function getToolName(type, x) {
	if (type == "tool") {
		return x < 25 ? toolNames[x - 1] : "Devourer Mk. " + romanize(x - 24);
	} else if (type == "comp") {
		return x <= compNames.length ? compNames[x - 1] : "Grey goo Mk. " + romanize(x - compNames.length);
	}
}

function getToolCurrency(type, x) {
	if (type == "tool") {
		return "$" + format(x ?? game.cash)
	} else if (type == "comp") {
		return format(x ?? game.artifacts) + " artifacts";
	}
}

function loadToolScreenInfo(tool) {
	if (tool) currentTool = tool;

	let level = getToolLevel(currentTool);
	let name = getToolName(currentTool, level);
	let nextName = getToolName(currentTool, level + 1);
	let damage = getToolDamage(currentTool, level);
	let nextDamage = getToolDamage(currentTool, level + 1);

	document.getElementById("currentTool").innerHTML = name
	if (name.length > 13) {document.getElementById("currentTool").style.fontSize = "6vh"}
	else {document.getElementById("currentTool").style.fontSize = "8vh"}
	document.getElementById("toolIconLarge").style.backgroundImage = "url('" + currentTool + "Icons/" + game.currentTool + ".png')"

	document.getElementById("nextTool").innerHTML = nextName

	if (currentTool == "tool") {
		if (damage < 1e6) document.getElementById("nextDamage").innerHTML = "Damage: " + format(damage) + " -> " + format(nextDamage)
		else document.getElementById("nextDamage").innerHTML = format(damage) + " -> " + format(nextDamage)
	} else if (currentTool == "comp") {
		if (damage < 1e6) document.getElementById("nextDamage").innerHTML = "Speed: " + format(damage) + "/s -> " + format(nextDamage) + "/s"
		else document.getElementById("nextDamage").innerHTML = format(damage) + "/s -> " + format(nextDamage) + "/s"
	}
	
	document.getElementById("nextToolCost").innerHTML = getToolCurrency(currentTool, getToolCost(currentTool))
	
	updateCurrencies()

	if (game.level >= 10) {
		document.getElementById("artifactBottomButton").style.color = "#860"
		document.getElementById("artifactBottomButton").innerHTML = "Gilding"
	}
	document.getElementById("artifactBottomButton").style.display = currentTool == "tool" ? "" : "none";

	document.getElementById("autoScreenButton").style.display = game.minerSoulTotal >= 1e4 ? "" : "none";
}

function closeToolScreen() {
	document.getElementById("toolScreen").style.left = "100%"
	updateOreUI();
}

function upgradeTool (tool) {
	tool ??= currentTool;
	let toolCost = 0
	toolCost = getToolCost(tool)
	if (tool == "tool" && game.cash >= toolCost) {
		game.cash -= toolCost

		updateCurrencies()

		game.currentTool++
		game.artifactBoost = 0
		game.artifactUsed = 0

		loadToolScreenInfo()
		calculateDamage()
	} else if (tool == "comp" && game.artifacts >= toolCost) {
		game.artifacts -= toolCost

		game.currentCompanion++

		loadToolScreenInfo()
		calculateDamage()
	}
}