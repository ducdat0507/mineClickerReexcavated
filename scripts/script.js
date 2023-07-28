//"It was very fun to play for a very long time. It managed to keep me playing for a couple of days!" -My google review for the original Mine Clicker from 2014
window.isDevVersion = window.location.href.indexOf('demonin.com') == -1

function reset() {
	game = {
		cash: 0,
		XP: 0,
		level: 1,
		baseDamage: 1,
		damage: 1,
		idleDamage: 1,
		activeDamage: 1,
		tapSpeed: 0,
		lastSave: Date.now(),
		lastVisualUpdate: Date.now(),
		totalOresMined: 0,
		timePlayed: 0,
		numberFormat: "standardLong",
		messages: true,
		unlockedOres: 1,
		currentTool: 1,
		currentCompanion: 1,
		upgradesBought: {},
		artifacts: 0,
		artifactChance: 0.05,
		artifactBoost: 0,
		ascensionPoints: 0,
		ascensionCash: 0,
		gameFinished: false,
	}
	for (let cat in upgrades) {
		game.upgradesBought[cat] = {};
		for (let id in upgrades[cat]) {
			game.upgradesBought[cat][id] = 0;
		}
	}
}

reset()

var currentOre = 1
var currentLayer = 1
var previousLayer = 1
var currentHitPoints = 1
var selectedUpgrade = 0
var messageTime = 0

let currentTool = "tool";

//If the user confirms the hard reset, resets all variables, saves and refreshes the page
function hardReset() {
  if (confirm("Are you sure you want to reset? You will lose everything!")) {
    reset()
    save()
    location.reload()
  }
}

function save() {
  //console.log("saving")
  game.lastSave = Date.now();
  localStorage.setItem("mineClickerSave", JSON.stringify(game));
  localStorage.setItem("mineClickerLastSaved", game.lastSave);
}
if (!window.isDevVersion || true) setInterval(save, 5000)

function load() {
	reset()
	let loadgame = JSON.parse(localStorage.getItem("mineClickerSave"))
	if (loadgame != null) {loadGame(loadgame)}
	//mainLoop = function() {
  //  updateVisuals();
  //  requestAnimationFrame(mainLoop);
  //};
  //requestAnimationFrame(mainLoop)
}

load()

function exportGame() {
  save()
  navigator.clipboard.writeText(btoa(JSON.stringify(game))).then(function() {
    alert("Copied to clipboard!")
  }, function() {
    alert("Error copying to clipboard, try again...")
  });
}

function importGame() {
  loadgame = JSON.parse(atob(prompt("Input your save here:")))
  if (loadgame && loadgame != null && loadgame != "") {
    reset()
    loadGame(loadgame)
    save()
		location.reload()
  }
  else {
    alert("Invalid input.")
  }
}

function deepCopy(from, to) {
	for (let key in to) {
		if (from[key] === undefined) {
			continue;
		}
		else if ((typeof(to[key])) == "object") {
			to[key] = deepCopy(from[key], to[key])
		}
		else {
			to[key] = from[key];
		}
	}
	return to;
}

function loadGame(loadgame) {
	game = deepCopy(loadgame, game);
	
	game.level = XPToLevel(Math.max(Math.floor(game.XP), 0))
	document.getElementById("level").innerHTML = game.level
	let XPToNextLevel = levelToXP(game.level + 1) - levelToXP(game.level)
	let ProgressToNextLevel = (game.XP - levelToXP(game.level)).toFixed(1)
	document.getElementById("XPBar").style.width = (ProgressToNextLevel / XPToNextLevel * 100) + "%"
	updateCurrencies()
	if (game.numberFormat == "standard") {
		document.getElementById("numberFormat").innerHTML = "Standard long"
	}
	else if (game.numberFormat == "standardLong") {
		document.getElementById("numberFormat").innerHTML = "Scientific"
	}
	else {
		document.getElementById("numberFormat").innerHTML = "Standard"
	}
	document.getElementById("topBarMessages").innerHTML = game.messages ? "On" : "Off"
}

function format(x,forceLargeFormat=false) {
	if (x==Infinity) {return "Infinity"}
	else if (game.numberFormat == "standard" && (forceLargeFormat || x>=1e6)) {
		let exponent = Math.floor(Math.log10(x) / 3)
		return formatSig(x/(1000**exponent), 5) + " " + illionsShort[exponent-1]
	}
	else if (game.numberFormat == "standardLong" && (forceLargeFormat || x>=1e6)) {
		let exponent = Math.floor(Math.log10(x) / 3)
		return formatSig(x/(1000**exponent), 3) + " " + illions[exponent-1]
	}
	else if (game.numberFormat == "scientific" && (forceLargeFormat || x>=1e6)) {
		let exponent = Math.floor(Math.log10(x))
		return formatSig(Math.floor(x/(10**exponent)*10000)/10000, 5) + "e" + exponent
	}
	else return Math.floor(x).toLocaleString("en-US")
}

function formatSig(x, digits = 2) {
	return x.toLocaleString("en-US", {
		minimumSignificantDigits: digits,
		maximumSignificantDigits: digits,
	})
}

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
	loadOre(currentOre)
	document.getElementById("cash").innerHTML = "$" + format(game.cash)
}

function getOreStats(x) {
	let rec = Math.floor((x - 1) / 78);
	let index = (x - 1) % 78;
	let factor = ((rec * rec + rec) / 2);
	return {
		transLevel: rec,
		icon: index + 1,
		name: (rec ? "Transcended " : "") + oreNames[index],
		value: oreValues[index] ** (rec + 1) * oreValues[77] ** factor,
		hitPoints: oreHitPoints[index] ** (rec + 1) * oreHitPoints[77] ** factor,
		hardness: oreHardnesses[index] ** (rec + 1) * oreHardnesses[77] ** factor,
	}
}

function loadOre(x) {
	let stats = getOreStats(x);
	if (x<78) {document.getElementById("oreIcon").style.filter = "drop-shadow(0 0 1vh #222)"}
	else {document.getElementById("oreIcon").style.filter = "none"}

	document.getElementById("oreIcon").style.backgroundImage = "url('oreIcons/" + stats.icon + ".png')"
	document.getElementById("oreName").innerHTML = stats.name
	if (stats.name > 13) {document.getElementById("oreName").style.fontSize = "5vh"}
	else {document.getElementById("oreName").style.fontSize = "7vh"}
	currentHitPoints = stats.hitPoints
	document.getElementById("currentOreValue").innerHTML = "$" + format(stats.value)
	document.getElementById("currentHitPoints").innerHTML = format(currentHitPoints)
	document.getElementById("maxHitPoints").innerHTML = format(currentHitPoints)
	document.getElementById("currentHardness").innerHTML = format(stats.hardness)

	let damage = Math.max(game.activeDamage - stats.hardness, 0)

	document.getElementById("currentDamage").innerHTML = format(damage)
	document.getElementById("currentNetGain").innerHTML = "$" + format(stats.value / Math.ceil(stats.hitPoints / damage))

	document.getElementById("currentDamage").style.color = 
	document.getElementById("currentNetGain").style.color = damage > 0 ? "" : "#f44"

	damage = Math.max(game.idleDamage - stats.hardness, 0)

	if (game.level > 5) {
		document.getElementById("currentIdleDamage").innerHTML = format(damage * game.tapSpeed)
		document.getElementById("currentIdleGain").innerHTML = "$" + format(stats.value / Math.ceil(stats.hitPoints / damage) * game.tapSpeed)
		document.getElementById("currentIdle").style.display = "";
	} else {
		document.getElementById("currentIdle").style.display = "none";
	}
	document.getElementById("currentIdleDamage").style.color = 
	document.getElementById("currentIdleGain").style.color = damage > 0 ? "" : "#f44"

	currentLayer = 1
	while (x>=layerPoints[currentLayer]) currentLayer++
	document.getElementById("main").style.backgroundImage = "url('texture" + currentLayer + ".png')"
	if (currentLayer != previousLayer) {
		setMessage(0,"Now entering: " + layerNames[currentLayer-1])
		previousLayer = currentLayer
	}
	
	if (x==1) {
		document.getElementById("arrowLeft").style.display = "none"
		document.getElementById("arrowSkipLeft").style.display = "none"
	}
	else {
		document.getElementById("arrowLeft").style.display = "block"
		document.getElementById("arrowSkipLeft").style.display = "block"
	}
	if (x>=game.unlockedOres) {
		document.getElementById("arrowRight").style.display = "none"
		document.getElementById("arrowSkipRight").style.display = "none"
	}
	else {
		document.getElementById("arrowRight").style.display = "block"
		document.getElementById("arrowSkipRight").style.display = "block"
	}
}

loadOre(1)

function nextOre() {
	currentOre++
	loadOre(currentOre)
}

function previousOre() {
	currentOre = Math.max(currentOre-1, 1)
	loadOre(currentOre)
}

function firstOre() {
	currentLayer = 1
	while ((currentOre-1)>=layerPoints[currentLayer]) currentLayer++
	currentOre = layerPoints[currentLayer-1]
	loadOre(currentOre)
}

function lastOre() {
	currentLayer = 1
	while (currentOre>=layerPoints[currentLayer]) currentLayer++
	if (layerPoints[currentLayer] > game.unlockedOres) {
		currentOre = game.unlockedOres
		loadOre(currentOre)
	}
	else {
		currentOre = layerPoints[currentLayer]
		loadOre(currentOre)
	}
}

function calculateDamage() {
	game.damage = game.baseDamage = getToolDamage("tool") * getUpgradeEffect("normal", 10);
	if (game.level >= 10) game.damage = game.damage * (1 + game.artifactBoost / 100)
	if (game.level >= 100) game.damage = game.damage * (1 + game.ascensionPoints / 100)

	game.activeDamage = game.idleDamage = game.damage;

	game.activeDamage *= getUpgradeEffect("normal", 1)
	game.activeDamage = Math.round(game.activeDamage)
	
	game.idleDamage *= getUpgradeEffect("normal", 2)
	game.idleDamage = Math.round(game.idleDamage)

	game.tapSpeed = game.level >= 5 ? getToolDamage("comp") : 0;

	console.log(game.baseDamage, game.damage, game.activeDamage, game.idleDamage)
}

function mineOre() {
	dealDamage(game.activeDamage);
}

function dealDamage(damage) {
	let stats = getOreStats(currentOre);

	currentHitPoints -= Math.max(damage - stats.hardness, 0);

	if (currentHitPoints <= 0) {
		currentHitPoints = stats.hitPoints;
		let factor = 1;
		let stack = 0;
		let chance = getUpgradeEffect("normal", 3)
		while (stack < getUpgradeEffect("normal", 9) && game.level >= 30 && Math.random() < chance) {
			factor *= 5
			chance /= 2
			stack++;
		}

		game.cash += stats.value * factor;
		game.ascensionCash += stats.value * factor;
		if (stack > 0) setMessage(2, "Ore duplicated!" + (stack > 1 ? " x" + format(stack) : ""))
		flash("cash", ["#7f7", "#8ff", "#ccf", "#ff7", "#f88"][Math.min(stack, 5)])

		game.totalOresMined++
		game.XP += 1.2 ** (currentOre-1) / 1.3
		game.level = XPToLevel(Math.max(Math.floor(game.XP), 0))
		document.getElementById("level").innerHTML = format(game.level)
		let XPToNextLevel = levelToXP(game.level + 1) - levelToXP(game.level)
		let ProgressToNextLevel = (game.XP - levelToXP(game.level)).toFixed(1)
		document.getElementById("XPBar").style.width = (ProgressToNextLevel / XPToNextLevel * 100) + "%"
		if (currentOre == game.unlockedOres) {
			game.unlockedOres++
			if (game.level >= 10) {
				game.artifacts += 1 + stack * getUpgradeEffect("normal", 12)
				setMessage(1,"Found an artifact!")
			}
			flash("artifacts", "#ff8");
			document.getElementById("arrowRight").style.display = "block"
			document.getElementById("arrowSkipRight").style.display = "block"
		}
		else if (game.level >= 10 && Math.random() < game.artifactChance) {
			game.artifacts += 1 + stack * getUpgradeEffect("normal", 12)
			setMessage(1,"Found an artifact!")
			flash("artifacts", "#ff8");
		}
		if (currentOre == 78 && !game.gameFinished) {
			document.getElementById("gameFinishScreen").style.display = "block"
			game.gameFinished = true
		}

		updateCurrencies();
	}
	document.getElementById("currentHitPoints").innerHTML = format(currentHitPoints)
}

function updateCurrencies() {
	document.getElementById("cash").innerHTML = "$" + format(game.cash)
	document.getElementById("upgradeScreenCash").innerHTML = "$" + format(game.cash)

	document.getElementById("ascensionScreenCash").innerHTML = "$" + format(game.ascensionCash)

	document.getElementById("artifacts").innerHTML = format(game.artifacts)
	document.getElementById("gildingScreenArtifacts").innerHTML = format(game.artifacts)
	document.getElementById("artifactHolder").style.display = game.level >= 10 && game.artifacts > 0 ? "" : "none";
	
	document.getElementById("toolScreenCash").innerHTML = getToolCurrency(currentTool)
}

function flash(target, color = "#8f8") {
	document.getElementById(target).style.transition = "none"
	document.getElementById(target).style.color = color
	setTimeout(function() {
		document.getElementById("cash").style.transition = "color 500ms"
		document.getElementById(target).style.color = ""
	}, 200)
}

function XPToLevel(x) {return Math.floor((x/5) ** 0.4) + 1} 
function levelToXP(x) {return Math.ceil((x - 1) ** (1/0.4) * 5)} 
function levelToColour(x) {
	colour = Math.floor(((x-1) ** 0.5) * 50) % 960
	stage = Math.ceil((colour + 1) / 160)
	if (stage == 1) {return "#c0" + (32 + colour).toString(16) + "20"} //Red to yellow
	else if (stage == 2) {return "#" + (192 - (colour - 160)).toString(16) + "c020"} //Yellow to green
	else if (stage == 3) {return "#20c0" + (32 + (colour - 320)).toString(16)} //Green to light blue
	else if (stage == 4) {return "#20" + (192 - (colour - 480)).toString(16) + "c0"} //Light blue to dark blue
	else if (stage == 5) {return "#" + (32 + (colour - 640)).toString(16) + "20c0"} //Dark blue to pink
	else if (stage == 6) {return "#c020" + (192 - (colour - 800)).toString(16)} //Pink to red
}

function enableDisableMessages() {
	game.messages = !game.messages
	document.getElementById("topBarMessages").innerHTML = game.messages ? "On" : "Off"
}

function setMessage(x,y) {
	let messageColours = ["#8f8", "#ff8", "#8ff"]
	if (game.messages) {
		document.getElementById("message").style.color = messageColours[x]
		document.getElementById("message").innerHTML = y
		messageTime = 2.5
	}
}

function updateVisuals() {
	if (messageTime == 0) {
		document.getElementById("sectionMessages").style.display = "none"
	}
	else if (messageTime < 1) {
		document.getElementById("sectionMessages").style.display = "block"
		document.getElementById("sectionMessages").style.opacity = messageTime
	}
	else {
		document.getElementById("sectionMessages").style.display = "block"
		document.getElementById("sectionMessages").style.opacity = "1"
	}
	let timeDivider = 1 / (Date.now() - game.lastVisualUpdate)
	if (messageTime > 0) messageTime -= timeDivider
	if (messageTime < 0) messageTime = 0
	game.lastVisualUpdate = Date.now()
	
	if (game.level >= 5) {
		document.getElementById("upgradeBottomButton").style.color = ""
		document.getElementById("upgradeBottomButton").innerHTML = "UPG"
	}
	if (game.level >= 100) {
		document.getElementById("ascensionBottomButton").style.color = "#60a"
		document.getElementById("ascensionBottomButton").innerHTML = "ASC"
	}
}

setInterval(updateVisuals, 16)

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
			return compDamages[compDamages.length - 1] + 5 * (x - compDamages.length)
		}
	}
}

function getToolCost(type, x) {
	if (x === undefined) x = getToolLevel(type)

	if (type == "tool") {
		if (x < 33) {
			return toolCosts[x - 1] * getUpgradeEffect("normal", 8)
		} else {
			return (x * 100) ** (x - 33) * toolCosts[32] * getUpgradeEffect("normal", 8)
		}
	} else if (type == "comp") {
		if (x <= compCosts.length) {
			return compCosts[x - 1]
		} else {
			return 10 * compCosts[compCosts.length - 1]
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
		return x <= compNames.length ? compNames[x - 1] : compNames[compNames.length - 1];
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
}

function closeToolScreen() {
	document.getElementById("toolScreen").style.left = "100%"
	loadOre(currentOre)
}

function upgradeTool () {
	let toolCost = 0
	toolCost = getToolCost(currentTool)
	if (currentTool == "tool" && game.cash >= toolCost) {
		game.cash -= toolCost

		updateCurrencies()

		game.currentTool++
		game.artifactBoost = 0

		loadToolScreenInfo()
		calculateDamage()
	} else if (currentTool == "comp" && game.artifacts >= toolCost) {
		game.artifacts -= toolCost

		game.currentCompanion++

		loadToolScreenInfo()
		calculateDamage()
	}
}

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

function useArtifact() {
	let count = Math.min(getUpgradeEffect("normal", 11), game.artifacts);
	if (count > 0) {
		game.artifacts -= count;
		let maxBoost = getUpgradeEffect("normal", 6)
		let artifactBoost = 5 * Math.random() * (10 + (1 / Math.random() * (Math.random() * (count - 1) * 2 + 1)))
		if (artifactBoost > maxBoost ** 0.5) artifactBoost = (artifactBoost * maxBoost ** 0.5) ** 0.5
		if (artifactBoost > maxBoost) artifactBoost = maxBoost;
		artifactBoost *= getUpgradeEffect("normal", 5);

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

function openAscensionScreen() {
	if (game.level >= 100) {
		document.getElementById("ascensionScreen").style.left = "0"
		document.getElementById("artifactScreen").style.left = "100%"
		document.getElementById("ascensionPoints").innerHTML = format(game.ascensionPoints)
		let ascensionPointsToGet = Math.floor(game.ascensionCash ** 0.12 * 5)
		ascensionPointsToGet = ascensionPointsToGet * getUpgradeEffect("normal", 7)
		ascensionPointsToGet = Math.max(ascensionPointsToGet - game.ascensionPoints, 0)
		document.getElementById("ascensionPointsToGet").innerHTML = format(ascensionPointsToGet)
		let nextAscensionPoint = (game.ascensionPoints + ascensionPointsToGet + 1) / getUpgradeEffect("normal", 7)
		nextAscensionPoint = Math.floor((nextAscensionPoint / 5) ** (1/0.12))
		document.getElementById("nextAscensionPoint").innerHTML = "$" + format(nextAscensionPoint)
	}
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
	currentOre = 1
	game.cash = 0
	game.ascensionCash = 0
	game.unlockedOres = 1
	game.currentTool = 1
	game.currentCompanion = 1
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
	loadOre(currentOre)
}

function openUpgradeScreen() {
	document.getElementById("upgradeScreen").style.left = "0"
	document.getElementById("toolScreen").style.left = "100%"
	document.getElementById("statsScreen").style.left = "-100%"

	document.getElementById("upgradeHolder").innerHTML = "";

	for (let id in upgrades["normal"]) {
		let data = upgrades["normal"][id];
		
		if (data.visible?.() === false) return;

		let upg = document.createElement("div");

		upg.classList.add("upgrade");

		upg.style.top = (data.row * 10 + 15) + "vh";
		upg.style.left = "calc(50% + " + (data.col * 10) + "vh)";
		upg.style.filter = data.req() ? "" : "invert(30%)";
		upg.style.backgroundImage = "url('upgrades/" + "normal" + "/" + id + ".png')";

		upg.onclick = () => displayUpgrade("normal", id);
		
		document.getElementById("upgradeHolder").appendChild(upg);
	}

	displayUpgrade(selectedUpgrade[0], selectedUpgrade[1])
}

function closeUpgradeScreen() {
	document.getElementById("upgradeScreen").style.left = "-100%"
	loadOre(currentOre)
}

function getUpgradeEffect(type, x) {
	let upgrade = upgrades[type]?.[x];
	let amount = game.upgradesBought[type]?.[x] ?? 0;
	return upgrade.effect(amount);
}

function displayUpgrade(type, x) {
	let upgrade = upgrades[type]?.[x];
	let amount = game.upgradesBought[type]?.[x] ?? 0;
	if (!upgrade) {
		document.getElementById("upgradeInfo").innerHTML = "Tap an upgrade for info"
		document.getElementById("upgradeButton").innerHTML = "Tap an upgrade for info"
	} else if (upgrade.req()) {
		selectedUpgrade = [type, x]
		document.getElementById("upgradeInfo").innerHTML = "<b>" + upgrade.title + "</b><br>" + 
			upgrade.effectDisplay(upgrade.effect(amount)) + " -> " + upgrade.effectDisplay(upgrade.effect(amount + 1)) + "<br>" + 
			upgrade.desc;
		document.getElementById("upgradeButton").innerHTML = "Buy for $" + format(upgrade.cost(amount));
	} else {
		selectedUpgrade = 0
		document.getElementById("upgradeInfo").innerHTML = "<b>Locked upgrade</b>"
		document.getElementById("upgradeButton").innerHTML = "Unlocks at " + upgrade.reqDisplay + "!"
	}
}

function buyUpgrade() {
	let [type, id] = selectedUpgrade;
	let upgrade = upgrades[type]?.[id];
	if (!upgrade) return;
	let amount = game.upgradesBought[type]?.[id] ?? 0;
	let cost = upgrade.cost(amount);
	if (game.cash >= cost) {
		game.cash -= cost;

		updateCurrencies()

		game.upgradesBought[type][id] = (game.upgradesBought[type][id] ?? 0) + 1;

		displayUpgrade(type, id)

		if (type == "normal" && id == 1)         calculateDamage()
		if (type == "normal" && id == 2)         calculateDamage()
		if (type == "normal" && id == 10)        calculateDamage()
		else if (type == "normal" && id == 4)    game.artifactChance = getUpgradeEffect("normal", 4)
	}
}

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

function adjustDivSize() {
    // Get the window's width and height
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;

    // Calculate the aspect ratios
    var aspectRatio = windowWidth / windowHeight;
    var maxAspectRatio = 9/16;

    // Get the divider by its ID
    var div = document.getElementById("main");

    // If the aspect ratio is more than the maximum, adjust the width
    if (aspectRatio > maxAspectRatio) {
      div.style.height = windowHeight + 'px';
      div.style.width = (windowHeight * maxAspectRatio) + 'px';
			for (i=0;i<document.getElementsByClassName("bottomButton").length;i++) document.getElementsByClassName("bottomButton")[i].style.height = (windowHeight * maxAspectRatio * 0.16) + "px" //Bottom buttons
			for (i=0;i<document.getElementsByClassName("bottomButton").length;i++) document.getElementsByClassName("bottomButton")[i].style.lineHeight = (windowHeight * maxAspectRatio * 0.16) + "px" //Bottom buttons
			document.getElementById("toolUpgradeButton").style.height = (windowHeight * maxAspectRatio * 0.24) + "px"
			document.getElementById("toolUpgradeButton").style.fontSize = (windowHeight * maxAspectRatio * 0.052) + "px"
			document.getElementById("upgradeButton").style.height = (windowHeight * maxAspectRatio * 0.16) + "px"
			document.getElementById("upgradeButton").style.lineHeight = (windowHeight * maxAspectRatio * 0.16) + "px"
			document.getElementById("upgradeButton").style.fontSize = (windowHeight * maxAspectRatio * 0.052) + "px"
			document.getElementById("ascendButton").style.height = (windowHeight * maxAspectRatio * 0.24) + "px"
			document.getElementById("ascendButton").style.fontSize = (windowHeight * maxAspectRatio * 0.052) + "px"
    }
    // Otherwise, use the full window size
    else {
      div.style.width = windowWidth + 'px';
      div.style.height = windowHeight + 'px';
			for (i=0;i<document.getElementsByClassName("bottomButton").length;i++) document.getElementsByClassName("bottomButton")[i].style.height = (windowWidth * 0.16) + "px" //Bottom buttons
			for (i=0;i<document.getElementsByClassName("bottomButton").length;i++) document.getElementsByClassName("bottomButton")[i].style.lineHeight = (windowWidth * 0.16) + "px" //Bottom buttons
			document.getElementById("toolUpgradeButton").style.height = (windowWidth * 0.24) + "px"
			document.getElementById("toolUpgradeButton").style.fontSize = (windowWidth * 0.052) + "px"
			document.getElementById("upgradeButton").style.height = (windowWidth * 0.16) + "px"
			document.getElementById("upgradeButton").style.fontSize = (windowWidth * 0.052) + "px"
			document.getElementById("ascendButton").style.height = (windowWidth * 0.24) + "px"
			document.getElementById("ascendButton").style.fontSize = (windowWidth * 0.052) + "px"
    }
}

// Run adjustDivSize initially to set the size on page load
adjustDivSize();

// Attach the function as an event listener to the window resize event
window.addEventListener('resize', adjustDivSize);

function romanize(x) {
	if (isNaN(x))
		return NaN;
	var digits = String(+x).split(""),
		key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
			"","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
			"","I","II","III","IV","V","VI","VII","VIII","IX"],
		roman = "",
		i = 3;
	while (i--)
		roman = (key[+digits.pop() + (i * 10)] || "") + roman;
	return Array(+digits.join("") + 1).join("M") + roman;
}

lastTimePlayedUp = Date.now()
let tapTimer = 0;
function timePlayedUp() {
	timePlayedDiff = (Date.now() - lastTimePlayedUp) / 1000
	game.timePlayed += timePlayedDiff
	lastTimePlayedUp = Date.now()
	if (document.getElementById("statsScreen").style.left == "0px") {
		let timePlayedFloor = Math.floor(game.timePlayed)
		let timePlayedHours = Math.floor(timePlayedFloor / 3600)
		let timePlayedMinutes = Math.floor(timePlayedFloor / 60) % 60
		let timePlayedSeconds = timePlayedFloor % 60
		let timeString = (timePlayedHours + ":" + ((timePlayedMinutes < 10 ? '0' : '') + timePlayedMinutes) + ":" + ((timePlayedSeconds < 10 ? '0' : '') + timePlayedSeconds))
		document.getElementById("timePlayed").innerHTML = timeString
	}

	if (game.level >= 5) {
		tapTimer += timePlayedDiff * game.tapSpeed;
		while (tapTimer > 1) {
			dealDamage(game.idleDamage);
			tapTimer--;
		}
	}
}

setInterval(timePlayedUp, 50)
