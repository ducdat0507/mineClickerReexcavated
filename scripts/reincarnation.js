let minerSoulLastUpdated = 0;
let minerSoulBreakdown = {};
let minerSoulBreakdownItems = {};

function openReincarnationScreen() {
	if (game.gameFinished || game.minerSoulTotal > 0) {
		document.getElementById("reincarnationScreen").style.left = "0"
		document.getElementById("ascensionScreen").style.left = "100%"
		document.getElementById("minerSouls").innerHTML = format(game.minerSouls)
		updateReincarnationGain();
	}
}

function closeReincarnationScreen() {
	document.getElementById("reincarnationScreen").style.left = "100%"
}

function updateReincarnationGain() {
	minerSoulBreakdown.base = getUpgradeEffect("reincarnation", 3);
	game.minerSoulRate = minerSoulBreakdown.base;

	minerSoulBreakdown.transcend = Math.floor((game.minerSoulBestOre - 1) / oreNames.length) ** 2 + 1;
	game.minerSoulRate *= minerSoulBreakdown.transcend;

	minerSoulBreakdown.cash = Math.log10(game.minerSoulCash + 1000) - 2;
	game.minerSoulRate *= minerSoulBreakdown.cash;

	minerSoulBreakdown.artifact = (Math.log2(game.minerSoulArtifacts + 1024) - 9) ** 1.5;
	game.minerSoulRate *= minerSoulBreakdown.artifact;

	minerSoulLastUpdated = Date.now();
	if (document.getElementById("reincarnationScreen").style.left == "0px") updateReincarnationUI();
}

function updateReincarnationUI() {
	if (!document.getElementById("minerSoulBreakdownBody").childElementCount) initReincarnationUI();

	for (let item in minerSoulBreakdown) minerSoulBreakdownItems[item].value.innerHTML = 
		item == "base" ? format(minerSoulBreakdown[item]) : "x" + formatWhole(minerSoulBreakdown[item], 1);
	document.getElementById("minerSoulRate").innerHTML = "+" + format(game.minerSoulRate) + " / hour";
	document.getElementById("minerSoulsToGet").innerHTML = format(game.minerSoulPending);
}

function initReincarnationUI() {
	let table = document.getElementById("minerSoulBreakdownBody");
	let items = {
		"base": "Base",
		"transcend": "Transcendence",
		"cash": "Total cash", 
		"artifact": "Total artifacts"
	}
	for (let item in items) {
		let row = document.createElement("tr");

		let header = document.createElement("th");
		header.scope = "row";
		header.innerHTML = items[item];

		let value = document.createElement("td");

		row.append(header, value);
		table.append(row);
		minerSoulBreakdownItems[item] = {row, header, value};
	}
}

function confirmReincarnation() {
	document.getElementById("reincarnationConfirmation").style.display = "block"
}

function cancelReincarnation() {
	document.getElementById("reincarnationConfirmation").style.display = "none"
}

function reincarnate() {
	let minerSoulsToGain = Math.floor(game.minerSoulPending);
	game.minerSouls += minerSoulsToGain;
    game.minerSoulTotal += minerSoulsToGain;

	game.cash = 0
	game.XP = 0
	game.level = 1
	game.baseDamage = 1
	game.messages = true
	game.unlockedOres = 1
	game.currentOre = 1
	game.currentTool = 1
	game.currentCompanion = 1
	game.artifacts = 0
	game.artifactChance = 0.05
	game.artifactBoost = 0
	game.artifactUsed = 0
	game.ascensionPoints = 0
	game.ascensionCash = 0
    game.minerSoulPending = 0
    game.minerSoulBestOre = 0
    game.minerSoulRate = 0
	game.minerSoulCash = 0
	game.minerSoulArtifacts = 0

	for (let upg in upgrades.normal) {
		if (!upgrades.normal[upg].keepOn?.includes("reincarnation")) {
			game.upgradesBought.normal[upg] = 0;
		}
	}

	calculateDamage()
	document.getElementById("reincarnationConfirmation").style.display = "none"
	document.getElementById("reincarnationScreen").style.left = "100%"
	updateCurrencies()
	loadOre(game.currentOre)
}