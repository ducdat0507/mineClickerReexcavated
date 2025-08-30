
var currentLayer = 1
var previousLayer = 1

var timeSinceLevelUp = 0;

function getOreStats(x) {
	let rec = Math.floor((x - 1) / 78);
	let index = (x - 1) % 78;
	let factor = ((rec * rec + rec) / 2);
	return {
		transLevel: rec,
		icon: index + 1,
		name: (rec ? "<small>Transcended</small> " : "") + oreNames[index],
		value: oreValues[index] ** (rec + 1) * (oreValues[77] * 7) ** factor,
		hitPoints: oreHitPoints[index] ** (rec + 1) * (oreHitPoints[77] / 7) ** factor,
		hardness: (oreHardnesses[index]) * (oreHitPoints[77] / 7) ** (factor + rec),
	}
}

function loadOre(x) {
	let stats = getOreStats(x);
	if (x%77==76) {
		document.getElementById("oreIcon").style.filter = "none"
	}
	else if (stats.transLevel) {
		document.getElementById("oreIcon").style.filter = "drop-shadow(0 0 1vh " + levelToColour(stats.transLevel) + ")"
	}
	else {
		document.getElementById("oreIcon").style.filter = "drop-shadow(0 0 1vh #222)"
	}

	document.getElementById("oreIcon").style.backgroundImage = "url('oreIcons/" + stats.icon + ".png')"
	document.getElementById("oreName").innerHTML = stats.name
	if (stats.name > 13) {document.getElementById("oreName").style.fontSize = "5vh"}
	else {document.getElementById("oreName").style.fontSize = "7vh"}
	currentHitPoints = stats.hitPoints
	document.getElementById("currentOreValue").innerHTML = "$" + format(stats.value)
	document.getElementById("currentHitPoints").innerHTML = format(currentHitPoints)
	document.getElementById("maxHitPoints").innerHTML = format(currentHitPoints)
	document.getElementById("currentHardness").innerHTML = format(stats.hardness)

	{
		let chance = 1;
		let {damage, income} = calculateOreDamage(x, game.activeDamage, [
			...new Array(getUpgradeEffect("normal", 20))
				.fill(0)
				.map((_, i) => [chance *= getUpgradeEffect("normal", 14) * 0.75 ** i, 5 ** (i + 1)])
		]);

		document.getElementById("currentDamage").innerHTML = format(damage)
		document.getElementById("currentNetGain").innerHTML = "$" + format(income)

		document.getElementById("currentDamage").style.color = 
		document.getElementById("currentNetGain").style.color = damage > 0 ? "" : "#f44";
	}
	{
		let chance = 1;
		let {damage, income} = calculateOreDamage(x, game.idleDamage, [
			...new Array(getUpgradeEffect("normal", 21))
				.fill(0)
				.map((_, i) => [chance *= getUpgradeEffect("normal", 15) * 0.75 ** i, 25 ** (i + 1)])
		]);

		if (game.level > 5) {
			document.getElementById("currentIdleDamage").innerHTML = format(damage * game.tapSpeed)
			document.getElementById("currentIdleGain").innerHTML = "$" + format(income * game.tapSpeed)
			document.getElementById("currentIdle").style.display = "";
		} else {
			document.getElementById("currentIdle").style.display = "none";
		}
		document.getElementById("currentIdleDamage").style.color = 
		document.getElementById("currentIdleGain").style.color = damage > 0 ? "" : "#f44"
	}

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

function calculateOreDamage(ore, damage, critList = []) {
	let stats = getOreStats(ore);
	critList.unshift([1, 1]);
	let result = {
		damage: 0,
		income: 0,
	}
	for (let i = 0; i < critList.length; i++) {
		let chance = critList[i][0] - (+critList[i+1]?.[0] || 0)
		let thisDamage = Math.max(damage * critList[i][1] - stats.hardness, 0)
		result.damage += thisDamage * chance;
		result.income += stats.value / Math.ceil(stats.hitPoints / thisDamage) * chance;
	}
	return result;
}

function nextOre() {
	game.currentOre++
	loadOre(game.currentOre)
}

function previousOre() {
	game.currentOre = Math.max(game.currentOre-1, 1)
	loadOre(game.currentOre)
}

function firstOre() {
	currentLayer = 1
	while ((game.currentOre-1)>=layerPoints[currentLayer]) currentLayer++
	game.currentOre = layerPoints[currentLayer-1]
	loadOre(game.currentOre)
}

function lastOre() {
	currentLayer = 1
	while (game.currentOre>=layerPoints[currentLayer]) currentLayer++
	if (layerPoints[currentLayer] > game.unlockedOres) {
		game.currentOre = game.unlockedOres
		loadOre(game.currentOre)
	}
	else {
		game.currentOre = layerPoints[currentLayer]
		loadOre(game.currentOre)
	}
}

function calculateDamage() {
	game.damage = game.baseDamage = getToolDamage("tool") * getUpgradeEffect("normal", 10);
	if (game.level >= 10) game.damage = game.damage * (1 + game.artifactBoost / 100)
	if (game.level >= 100) game.damage = game.damage * (1 + game.ascensionPoints / 100);

	game.activeDamage = game.idleDamage = game.damage;

	game.activeDamage *= getUpgradeEffect("normal", 1)
	game.activeDamage = Math.round(game.activeDamage)
	
	game.idleDamage *= getUpgradeEffect("normal", 2)
	game.idleDamage = Math.round(game.idleDamage)

	game.tapSpeed = game.level >= 5 ? getToolDamage("comp") : 0;

	console.log(game.baseDamage, game.damage, game.activeDamage, game.idleDamage)
}

function mineOre() {
	let damage = game.activeDamage;
	let factor = 1;
	let stack = 0;
	let chance = getUpgradeEffect("normal", 14);
	while (stack < getUpgradeEffect("normal", 20) && Math.random() < chance) {
		factor *= 5
		chance *= 0.75;
		stack++;
	}
	if (stack) {
		flash("currentHitPoints", "#f88");
	}
	dealDamage(damage * factor);
}

function dealDamage(damage) {
	let stats = getOreStats(game.currentOre);

	currentHitPoints -= Math.max(damage - stats.hardness, 0);

	if (currentHitPoints <= 0) {
		currentHitPoints = stats.hitPoints;
		let factor = 1;
		let stack = 0;
		let chance = getUpgradeEffect("normal", 3)
		while (stack < getUpgradeEffect("normal", 9) && game.level >= 30 && Math.random() < chance) {
			factor *= 5
			chance *= 1 - getUpgradeEffect("normal", 13);
			stack++;
		}

        let cashGain = stats.value * factor * getUpgradeEffect("reincarnation", 1);

		game.cash += cashGain;
		game.ascensionCash += cashGain;
		game.minerSoulCash += cashGain;
		if (stack > 0) setMessage(2, "Ore duplicated!" + (stack > 1 ? " x" + format(stack) : ""))
		flash("cash", levelToColour(stack))

		game.totalOresMined++
		game.XP += 1.2 ** (game.currentOre-1) / 1.3
		let newLevel = XPToLevel(Math.max(Math.floor(game.XP), 0));
		let isNewLevel = game.level != newLevel;
		game.level = newLevel;
		document.getElementById("level").innerHTML = format(game.level)
		let XPToNextLevel = levelToXP(game.level + 1) - levelToXP(game.level)
		let ProgressToNextLevel = (game.XP - levelToXP(game.level)).toFixed(1)
		document.getElementById("XPBar").style.width = (ProgressToNextLevel / XPToNextLevel * 100) + "%";
		if (isNewLevel) {
			document.getElementById("XPBar").animate([
				{ filter: "grayscale(1) brightness(1.5)", width: "100%", left: "0", easing: "cubic-bezier(.2, .8, .2, .8)" },
				{ filter: "grayscale(1) brightness(1.5)", width: "100%", left: "100%", offset: 0.2 },
				{ filter: "none", width: "0", left: "0%", offset: 0.2, easing: "cubic-bezier(.2, .8, .2, .8)" },
				{ left: "0%" },
			], {
				duration: 1000,
			});
		}

		if (game.currentOre == game.unlockedOres) {
			game.unlockedOres++
			if (game.level >= 10) {
                let artifactGain = getArtifactGain(stack) * getUpgradeEffect("normal", 23)
				game.artifacts += artifactGain;
                game.minerSoulArtifacts += artifactGain;
				setMessage(1,"Found an artifact!")
			}
			flash("artifacts", "#ff8");
			document.getElementById("arrowRight").style.display = "block"
			document.getElementById("arrowSkipRight").style.display = "block"
		}
		else if (game.level >= 10 && Math.random() < game.artifactChance) {
            let artifactGain = getArtifactGain(stack);
            game.artifacts += artifactGain;
            game.minerSoulArtifacts += artifactGain;
			setMessage(1,"Found an artifact!")
			flash("artifacts", "#ff8");
		}
		if (game.currentOre == 78 && !game.gameFinished) {
			document.getElementById("gameFinishScreen").style.display = "block"
			game.gameFinished = true
		}

		updateCurrencies();
	}
	document.getElementById("currentHitPoints").innerHTML = format(currentHitPoints)
}