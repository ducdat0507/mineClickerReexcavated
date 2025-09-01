
var currentLayer = 1
var previousLayer = 1

var timeSinceLevelUp = 0;

function getOreStats(x) {
	let length = oreNames.length;
	let rec = Math.floor((x - 1) / length);
	let index = (x - 1) % length;
	let factor = ((rec * rec + rec) / 2);

	let name = oreNames[index];
	if (index == length - 1 && rec) name = name + " " + romanize(rec + 1);
	else if (rec) name = "<small>Transcended" + (rec >= 2 ? `<sup>${format(rec)}</sup>` : "") + "</small> " + name;

	return {
		transLevel: rec,
		icon: index + 1,
		name: name,
		value: oreValues[index] ** (rec + 1) * (oreValues[length - 1] * 7) ** factor,
		hitPoints: oreHitPoints[index] ** (rec + 1) * (oreHitPoints[length - 1] / 7) ** factor,
		hardness: Math.max(oreHardnesses[index], (index + 1) * rec / 100) * (oreHitPoints[index] ** rec) * ((oreHitPoints[length - 1] / 7) ** (factor)),
	}
}

function loadOre(x) {
	let stats = getOreStats(x);

	currentHitPoints = stats.hitPoints

	currentLayer = 1
	while ((x - 1) % oreNames.length >= layerPoints[currentLayer] - 1) currentLayer++;

	updateOreUI(stats);
}

function updateOreUI(stats) {
	stats ??= getOreStats(game.currentOre);

	if (game.currentOre % 77 == 76) {
		document.getElementById("oreIcon").style.filter = "none"
	}
	else if (stats.transLevel) {
		document.getElementById("oreIcon").style.filter = "drop-shadow(0 0 2vh " + levelToColour(stats.transLevel) + ")"
	}
	else {
		document.getElementById("oreIcon").style.filter = "drop-shadow(0 0 1vh #222)"
	}

	document.getElementById("oreIcon").style.backgroundImage = "url('oreIcons/" + stats.icon + ".png')"
	document.getElementById("oreName").innerHTML = stats.name
	let realName = document.getElementById("oreName").textContent;
	if (realName.length > 18) {document.getElementById("oreName").style.fontSize = "5vh"}
	else if (realName.length > 13) {document.getElementById("oreName").style.fontSize = "6vh"}
	else {document.getElementById("oreName").style.fontSize = "7vh"}
	document.getElementById("currentOreValue").innerHTML = "$" + format(stats.value)
	document.getElementById("currentHitPoints").innerHTML = format(currentHitPoints)
	document.getElementById("maxHitPoints").innerHTML = format(stats.hitPoints)
	document.getElementById("currentHardness").innerHTML = format(stats.hardness)


	document.getElementById("background").style.backgroundImage = "url('texture" + (currentLayer) + ".png')"
	document.getElementById("background").style.boxShadow = game.currentOre > oreNames.length ? `inset 0 0 30vh ${levelToColour(stats.transLevel)}` : "";
	if (currentLayer != previousLayer) {
		setMessage(0,"Now entering: " + layerNames[currentLayer-1])
		previousLayer = currentLayer
	}
	
	if (game.currentOre == 1) {
		document.getElementById("arrowLeft").style.display = "none"
		document.getElementById("arrowSkipLeft").style.display = "none"
	}
	else {
		document.getElementById("arrowLeft").style.display = "block"
		document.getElementById("arrowSkipLeft").style.display = "block"
	}
	if (game.currentOre >= game.unlockedOres) {
		document.getElementById("arrowRight").style.display = "none"
		document.getElementById("arrowSkipRight").style.display = "none"
	}
	else {
		document.getElementById("arrowRight").style.display = "block"
		document.getElementById("arrowSkipRight").style.display = "block"
	}


	updateOreDamageUI(stats);
}

function updateOreDamageUI(stats) {
	stats ??= getOreStats(game.currentOre);
	{
		let chance = 1;
		let {damage, income, rate} = calculateOreDamage(game.currentOre, game.activeDamage, [
			...new Array(getUpgradeEffect("normal", 20))
				.fill(0)
				.map((_, i) => [chance *= getUpgradeEffect("normal", 14) * 0.75 ** i, 5 ** (i + 1)])
		]);

			switch(game.homeStat) {
				case "breakRate": 
					if (rate <= 1) {
						rate = 1 / rate;
						document.getElementById("currentDamage").innerHTML = 
							rate >= 1000 ? format(rate) : formatWhole(rate, 2);
						document.getElementById("currentActiveStat").innerHTML = "breaks / tap";
					} else {
						document.getElementById("currentDamage").innerHTML = 
							rate >= 1000 ? format(rate) : formatWhole(rate, 2);
						document.getElementById("currentActiveStat").innerHTML = "taps / break";
					}
					break;

				case "damage": default:
					document.getElementById("currentDamage").innerHTML = format(damage);
			}
		document.getElementById("currentNetGain").innerHTML = "$" + format(income)

		document.getElementById("currentDamage").style.color = 
		document.getElementById("currentNetGain").style.color = damage > 0 ? "" : "#f44";
	}
	{
		let chance = 1;
		let {damage, income, rate} = calculateOreDamage(game.currentOre, game.idleDamage, [
			...new Array(getUpgradeEffect("normal", 21))
				.fill(0)
				.map((_, i) => [chance *= getUpgradeEffect("normal", 15) * 0.75 ** i, 25 ** (i + 1)])
		]);

		rate /= game.tapSpeed;
		damage *= game.tapSpeed;
		income *= game.tapSpeed;

		if (game.level > 5) {
			switch(game.homeStat) {
				case "breakRate": 
					if (rate <= 1) {
						rate = 1 / rate;
						document.getElementById("currentIdleDamage").innerHTML = 
							rate >= 1000 ? format(rate) : formatWhole(rate, 2);
						document.getElementById("currentIdleStat").innerHTML = "breaks / sec";
					} else {
						document.getElementById("currentIdleDamage").innerHTML = 
							rate >= 1000 ? format(rate) : formatWhole(rate, 2);
						document.getElementById("currentIdleStat").innerHTML = "secs / break";
					}
					break;

				case "damage": default:
					document.getElementById("currentIdleDamage").innerHTML = format(damage);
			}
			document.getElementById("currentIdleGain").innerHTML = "$" + format(income)
			document.getElementById("currentIdle").style.display = "";
		} else {
			document.getElementById("currentIdle").style.display = "none";
		}
		document.getElementById("currentIdleDamage").style.color = 
		document.getElementById("currentIdleGain").style.color = damage > 0 ? "" : "#f44"
	}
}

function calculateOreDamage(ore, damage, critList = []) {
	let stats = getOreStats(ore);
	critList.unshift([1, 1]);
	let result = {
		damage: 0,
		rate: 0,
		income: 0,
	}
	for (let i = 0; i < critList.length; i++) {
		let chance = critList[i][0] - (+critList[i+1]?.[0] || 0)
		let thisDamage = Math.max(damage * critList[i][1] - stats.hardness, 0)
		result.damage += thisDamage * chance;
		result.rate += 1 / Math.ceil(stats.hitPoints / thisDamage) * chance;
	}
	result.rate = 1 / result.rate;
	result.income = stats.value / result.rate;
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

function doIdleDamage(times) {

	let damage = game.idleDamage;
	let factors = doFactors(
		times, 
		getUpgradeEffect("normal", 15),
		0.5,
		getUpgradeEffect("normal", 21)
	)
	for (let factor in factors) {
		factorTimes = factors[factor];
		dealDamage(damage * 25 ** factor, factorTimes);
	}
	if (factors) {
		flash("currentHitPoints", "#f88");
	}
}

function dealDamage(damage, times = 1) {
	let stats = getOreStats(game.currentOre);
	damage -= stats.hardness;
	if (damage <= 0) return;

	let timesPerLoot = Math.ceil(stats.hitPoints / damage);
	let effectiveHitPoints = damage * timesPerLoot;
	let timesAlreadyHit = Math.floor((effectiveHitPoints - currentHitPoints) / damage);
	if (times + timesAlreadyHit >= timesPerLoot) {
		lootOre(Math.floor((times + timesAlreadyHit) / timesPerLoot));
		times = (times + timesAlreadyHit) % timesPerLoot;
		currentHitPoints = stats.hitPoints - damage * times;
	} else {
		currentHitPoints -= damage * times;
	}

	document.getElementById("currentHitPoints").innerHTML = format(currentHitPoints)

	if (game.auto.advance && game.activeDamage - stats.hardness >= stats.hitPoints * 4 ** (stats.transLevel + 1)) {
		nextOre();
	}
}

function lootOre(times = 1) {
	let stats = getOreStats(game.currentOre);

	let factors = doFactors(
		times,
		getUpgradeEffect("normal", 3),
		getUpgradeEffect("normal", 13),
		getUpgradeEffect("normal", 9)
	)
	let maxFactor = Object.keys(factors).at(-1) ?? 0;
	
	let cashGain = 0, artifactGain = 0;
	for (let factor in factors) {
		cashGain += 5 ** factor * factors[factor];
		artifactGain += getArtifactGain(factor) * factors[factor];
	}
	cashGain *= stats.value * getUpgradeEffect("reincarnation", 1);

	game.cash += cashGain;
	game.ascensionCash += cashGain;
	game.minerSoulCash += cashGain;
	if (maxFactor) setMessage(2, "Ore duplicated!" + (maxFactor > 1 ? " x" + format(maxFactor) : ""))
	flash("cash", levelToColour(maxFactor))

	game.totalOresMined += times;
	game.XP += 1.2 ** (game.currentOre-1) / 1.3 * times;
	let newLevel = XPToLevel(Math.max(Math.floor(game.XP), 0));
	let isNewLevel = game.level != newLevel;
	game.level = newLevel;
	document.getElementById("level").innerHTML = format(game.level);
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

	if (game.currentOre >= game.unlockedOres) {
		game.unlockedOres++;
		game.minerSoulBestOre = Math.max(game.minerSoulBestOre, game.unlockedOres);
		if (game.level >= 10) {
			artifactGain *= getUpgradeEffect("normal", 23);
			game.artifacts += artifactGain;
			game.minerSoulArtifacts += artifactGain;
			setMessage(1,"Found an artifact!" + (maxFactor > 1 ? " x" + format(maxFactor) : ""))
			flash("artifacts", "#ff8");
		}
		document.getElementById("arrowRight").style.display = "block"
		document.getElementById("arrowSkipRight").style.display = "block"
	}
	else if (game.level >= 10 && Math.random() < game.artifactChance) {
		game.artifacts += artifactGain;
		game.minerSoulArtifacts += artifactGain;
		setMessage(1,"Found an artifact!" + (maxFactor > 1 ? " x" + format(maxFactor) : ""))
		flash("artifacts", "#ff8");
	}
	if (game.currentOre == 78 && !game.gameFinished) {
		document.getElementById("gameFinishScreen").style.display = "block"
		game.gameFinished = true
	}

	updateCurrencies();
}