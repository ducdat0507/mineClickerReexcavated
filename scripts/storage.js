
function initSave() {
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
		homeStat: "damage",
		messages: true,
		unlockedOres: 1,
		currentOre: 1,
		currentTool: 1,
		currentCompanion: 1,
		upgradesBought: {},
		artifacts: 0,
		artifactChance: 0.05,
		artifactBoost: 0,
		artifactUsed: 0,
		ascensionPoints: 0,
		ascensionCash: 0,
		gameFinished: false,
        minerSouls: 0,
        minerSoulTotal: 0,
        minerSoulPending: 1500,
        minerSoulRate: 0,
        minerSoulBestOre: 0,
		minerSoulCash: 0,
		minerSoulArtifacts: 0,
	}
	for (let cat in upgrades) {
		game.upgradesBought[cat] = {};
		for (let id in upgrades[cat]) {
			game.upgradesBought[cat][id] = 0;
		}
	}
}

function hardReset() {
  if (confirm("Are you sure you want to reset? You will lose everything!")) {
    initSave()
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

function load() {
	initSave()
	let loadgame = JSON.parse(localStorage.getItem("mineClickerSave"))
	if (loadgame != null) {loadGame(loadgame)}
	//mainLoop = function() {
  //  updateVisuals();
  //  requestAnimationFrame(mainLoop);
  //};
  //requestAnimationFrame(mainLoop)
}

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
    initSave()
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
		else if ((typeof to[key]) == "number" && from[key] === null) {
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