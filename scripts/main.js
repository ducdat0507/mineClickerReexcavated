

function loadGame(loadgame) {
	game = deepCopy(loadgame, game);
	
	game.level = XPToLevel(Math.max(Math.floor(game.XP), 0))
	document.getElementById("level").innerHTML = game.level
	let XPToNextLevel = levelToXP(game.level + 1) - levelToXP(game.level)
	let ProgressToNextLevel = (game.XP - levelToXP(game.level)).toFixed(1)
	document.getElementById("XPBar").style.width = (ProgressToNextLevel / XPToNextLevel * 100) + "%"
	updateSettings();
	updateCurrencies();
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

		if (tapTimer > 0) {
			doIdleDamage(Math.floor(tapTimer));
			tapTimer %= 1;
		}
	}

    if (game.gameFinished) {
        if (time - minerSoulLastUpdated > 1000) {
			updateReincarnationGain();
			if (selectedUpgrade[1] == "$all") displayUpgrade(selectedUpgrade[0], selectedUpgrade[1]);
			
			let hasAuto;
			if (game.auto.tool) {
				hasAuto = true;
				upgradeTool("tool");
			}
			if (game.auto.comp) {
				hasAuto = true;
				upgradeTool("comp");
			}
			if (game.auto.artifact && game.artifactBoost < getUpgradeEffect("normal", 5) * getUpgradeEffect("normal", 6)) {
				hasAuto = true;
				useArtifact();
			}

			if (hasAuto) {
				updateOreDamageUI();
			}
		}
        game.minerSoulPending += game.minerSoulRate * delta / 3600;
    }
	if (game.auto.upgrade) {
		let rate = Math.log10(game.level + 10) ** 0.5;
		autoUpgradeTime += rate * delta;
		let hasAuto = false;
		while (rate >= 1) {
			if (buyUpgrade("normal", "$all")) {
				hasAuto = true;
				rate -= 1;
			} else {
				rate %= 1;
			}
		}

		if (hasAuto) {
			updateOreDamageUI();
		}
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