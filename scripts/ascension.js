

function openAscensionScreen() {
	if (game.level >= 100 || game.minerSoulTotal > 0) {
		document.getElementById("ascensionScreen").style.left = "0"
		document.getElementById("artifactScreen").style.left = "100%"
		document.getElementById("ascensionPoints").innerHTML = format(game.ascensionPoints)
		updateAscensionGain();
	}
}

function updateAscensionGain() {
	let ascensionPointsToGet = Math.floor(game.ascensionCash ** 0.12 * 5)
	ascensionPointsToGet = ascensionPointsToGet * getUpgradeEffect("normal", 7)
	ascensionPointsToGet = Math.max(ascensionPointsToGet - game.ascensionPoints, 0)
	document.getElementById("ascensionPointsToGet").innerHTML = format(ascensionPointsToGet)
	let nextAscensionPoint = (game.ascensionPoints + ascensionPointsToGet + 1) / getUpgradeEffect("normal", 7)
	nextAscensionPoint = Math.floor((nextAscensionPoint / 5) ** (1/0.12))
	document.getElementById("nextAscensionPoint").innerHTML = "$" + format(nextAscensionPoint)
}

function closeAscensionScreen() {
	document.getElementById("ascensionScreen").style.left = "100%"
}

function confirmAscension() {
	document.getElementById("ascensionConfirmation").style.display = "block"
}

function cancelAscension() {
	document.getElementById("ascensionConfirmation").style.display = "none"
}

function ascend() {
	let ascensionPointsToGet = Math.floor(game.ascensionCash ** 0.12 * 5)
	ascensionPointsToGet = ascensionPointsToGet * getUpgradeEffect("normal", 7)
	ascensionPointsToGet = Math.max(ascensionPointsToGet - game.ascensionPoints, 0)
	game.ascensionPoints += ascensionPointsToGet
	game.currentOre = 1
	game.cash = getUpgradeEffect("normal", 18)
	game.ascensionCash = 0
	game.unlockedOres = 1
	game.currentTool = getUpgradeEffect("normal", 17) + 1
	game.currentCompanion = getUpgradeEffect("normal", 16) + 1
	game.artifacts = 0
	game.artifactChance = 0.05
	game.artifactBoost = 0
	game.baseDamage = 1

	for (let upg in upgrades.normal) {
		if (!upgrades.normal[upg].keepOn?.includes("ascension")) {
			game.upgradesBought.normal[upg] = 0;
		}
	}

	calculateDamage()
	document.getElementById("ascensionConfirmation").style.display = "none"
	document.getElementById("ascensionScreen").style.left = "100%"
	document.getElementById("toolScreen").style.left = "100%"
	updateCurrencies()
	loadOre(game.currentOre)
}