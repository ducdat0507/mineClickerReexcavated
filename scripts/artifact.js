

function openArtifactScreen() {
	if (game.level >= 10) {
		document.getElementById("artifactScreen").style.left = "0"
		document.getElementById("ascensionScreen").style.left = "100%"
		document.getElementById("artifactChance").innerHTML = format(game.artifactChance)
		document.getElementById("artifactBoost").innerHTML = format(game.artifactBoost)
		document.getElementById("artifactBoostCap").innerHTML = format(getUpgradeEffect("normal", 6) * getUpgradeEffect("normal", 5))
		document.getElementById("lastBoost").innerHTML = ""
	}
}

function closeArtifactScreen() {
	document.getElementById("artifactScreen").style.left = "100%"
}

function getArtifactGain(stack) {
    let gain = 1 + stack ** getUpgradeEffect("normal", 22) * getUpgradeEffect("normal", 12)
    gain *= getUpgradeEffect("reincarnation", 2);
    return gain;
}

function useArtifact() {
	let count = Math.min(getUpgradeEffect("normal", 11), game.artifacts);
	if (count > 0) {
		let multi = getUpgradeEffect("normal", 5);
		game.artifacts -= count;
		game.artifactUsed += count;
		let maxBoost = getUpgradeEffect("normal", 6)
		let artifactBoost = 5 * Math.random() * (10 + (1 / Math.random() * (Math.random() * (count - 1) * 2 + 1)))
		if (artifactBoost > maxBoost ** 0.5) artifactBoost = (artifactBoost * maxBoost ** 0.5) ** 0.5
		artifactBoost += getUpgradeEffect("normal", 19) * game.artifactUsed / multi;
		if (artifactBoost > maxBoost) artifactBoost = maxBoost;
		artifactBoost *= multi;

		if (artifactBoost > game.artifactBoost) {
			game.artifactBoost = artifactBoost
			document.getElementById("artifactBoost").innerHTML = format(game.artifactBoost)
			document.getElementById("lastBoost").style.color = "#8f8"
			document.getElementById("lastBoost").innerHTML = "Tool upgraded! (" + format(artifactBoost) + "%)"
			calculateDamage()
		}
		else {
			document.getElementById("lastBoost").style.color = "#bbb"
			document.getElementById("lastBoost").innerHTML = "Not strong enough... (" + format(artifactBoost) + "%)"
		}
		document.getElementById("gildingScreenArtifacts").innerHTML = format(game.artifacts)
	}
}