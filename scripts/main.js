

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



let time = Date.now()
let tapTimer = 0;
let delta = 0;
function tick() {
	delta = (Date.now() - time)
	time += delta;
    delta /= 1000;

	game.timePlayed += delta

	if (document.getElementById("statsScreen").style.left == "0px") {
		let timePlayedFloor = Math.floor(game.timePlayed)
		let timePlayedHours = Math.floor(timePlayedFloor / 3600)
		let timePlayedMinutes = Math.floor(timePlayedFloor / 60) % 60
		let timePlayedSeconds = timePlayedFloor % 60
		let timeString = (timePlayedHours + ":" + ((timePlayedMinutes < 10 ? '0' : '') + timePlayedMinutes) + ":" + ((timePlayedSeconds < 10 ? '0' : '') + timePlayedSeconds))
		document.getElementById("timePlayed").innerHTML = timeString
	}

	if (game.level >= 5) {
		tapTimer += delta * game.tapSpeed;
		let damage = game.idleDamage;
		let chance = getUpgradeEffect("normal", 15);
		let count = 0;
		let totalStack = 0;
		while (tapTimer > 1 && count < 10000) {
			let factor = 1;
			let stack = 0;
			while (stack < getUpgradeEffect("normal", 21) && Math.random() < chance) {
				factor *= 25
				chance *= 0.5;
				stack++;
				totalStack++;
			}
			dealDamage(damage * factor);
			tapTimer--;
			count++;
		}
		if (totalStack) {
			flash("currentHitPoints", "#f88");
		}
	}

    if (game.gameFinished) {
        if (time - minerSoulLastUpdated > 1000) {
			updateReincarnationGain();
			if (selectedUpgrade[1] == "$all") displayUpgrade(selectedUpgrade[0], selectedUpgrade[1]);
		}
        game.minerSoulPending += game.minerSoulRate * delta / 3600;
    }

    updateVisuals();
}

window.addEventListener("DOMContentLoaded", () => {
    load()
    loadOre(game.currentOre);
    adjustDivSize();
    setInterval(tick, 50);
    if (!window.isDevVersion || true) setInterval(save, 5000)
})