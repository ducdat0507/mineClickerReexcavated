

var selectedUpgrade = [null, null]
var currentUpgradePage = 0;

function openUpgradeScreen() {
    if (game.level >= 5 || game.minerSoulTotal > 0) {
        document.getElementById("upgradeScreen").style.left = "0"
        document.getElementById("toolScreen").style.left = "100%"
        document.getElementById("statsScreen").style.left = "-100%"

        updateUpgrades();

        displayUpgrade(selectedUpgrade[0], selectedUpgrade[1])
    }
}

let upgradeButtons = {};

function initUpgrades() {
    let index = 0;
    for (let type in upgrades) {
        const indexConst = index;
        upgradeButtons[type] = {}
        let holder = document.getElementById("upgradeHolder_" + type);
        for (let id in upgrades[type]) {
            let data = upgrades[type][id];
            let upg = document.createElement("div");
            upg.classList.add("upgrade");

            if (id == "$next") {
                upg.style.top = "55vh";
                upg.style.left = "calc(50% + 20vh)";
                upg.style.backgroundImage = "url('upgrades/next.png')";
                upg.onclick = () => setUpgradePage(indexConst + 1);
            } else if (id == "$all") {
                upg.style.top = (data.row * 10 + 15) + "vh";
                upg.style.left = "calc(50% + " + (data.col * 10) + "vh)";
                upg.style.backgroundImage = "url('upgrades/all.png')";
                upg.onclick = () => displayUpgrade(type, id);
            } else {
                upg.style.top = (data.row * 10 + 15) + "vh";
                upg.style.left = "calc(50% + " + (data.col * 10) + "vh)";
                upg.style.backgroundImage = "url('upgrades/" + type + "/" + id + ".png')";
                upg.onclick = () => displayUpgrade(type, id);
            }

            upgradeButtons[type][id] = upg
            holder.appendChild(upg);
        }
        if (index > 0) {
            let upg = document.createElement("div");
            upg.classList.add("upgrade");
            upg.style.top = "55vh";
            upg.style.left = "calc(50% - 20vh)";
            upg.style.backgroundImage = "url('upgrades/previous.png')";
            upg.onclick = () => setUpgradePage(indexConst - 1);
            holder.appendChild(upg);
        }
        index++;
    }
}
function updateUpgrades() {
	if (!upgradeButtons.normal) initUpgrades();
    let type = ["normal", "reincarnation"][currentUpgradePage];
	for (let id in upgrades[type]) {
		let data = upgrades[type][id];

		let visible = data.visible?.() ?? true;
		upgradeButtons[type][id].style.display = visible ? "" : "none";
		if (!visible || id.startsWith("$")) continue;

		let selected = selectedUpgrade[0] == type && selectedUpgrade[1] == id;
		upgradeButtons[type][id].classList.toggle("selected", selected);
		let unlocked = data.req();
		upgradeButtons[type][id].style.opacity = 
			(unlocked ? "" : "0.5");
		upgradeButtons[type][id].style.filter = 
			(selected ? "drop-shadow(0 0 1vh white)" : "");
		if (!unlocked) continue;

		let amount = game.upgradesBought[type]?.[id] ?? 0;
		let cost = data.cost(amount);
		let costType = data.costType || "cash";
		let canBuy = game[costType] >= cost;
		upgradeButtons[type][id].classList.toggle("can-buy", canBuy);
	}
}

function setUpgradePage(page) {
    currentUpgradePage = page;
    document.getElementById("upgradeScreen").style.setProperty("--page", page);
    updateUpgrades();
}

function closeUpgradeScreen() {
	document.getElementById("upgradeScreen").style.left = "-100%"
	updateOreUI();
}

function getUpgradeEffect(type, x) {
	let upgrade = upgrades[type]?.[x];
	let amount = game.upgradesBought[type]?.[x] ?? 0;
	return upgrade.effect?.(amount) || amount;
}

function getUpgradeCurrencyName(name) {
    return {
        minerSouls: "miner's souls"
    }[name] || name;
}

function displayUpgrade(type, x) {
	let upgrade = upgrades[type]?.[x];
	let amount = game.upgradesBought[type]?.[x] ?? 0;
	if (!upgrade) {
		document.getElementById("upgradeInfo").innerHTML = "Tap an upgrade for info"
		document.getElementById("upgradeButton").innerHTML = "Tap an upgrade for info"
	} else if (x == "$all") {
		selectedUpgrade = [type, x]
		let cheapestUpgrade = getCheapestUpgrade(type);
		if (cheapestUpgrade) {
			upgrade = cheapestUpgrade[1];
			amount = game.upgradesBought[type]?.[cheapestUpgrade[0]] ?? 0;
		}
		document.getElementById("upgradeInfo").innerHTML = "<b>The EZBuy button&trade;</b><br>Purchase the cheapest upgrade:<br>"
			+ upgrade.title ?? "None";
		document.getElementById("upgradeButton").innerHTML = (
			!upgrade ? "Can't buy"
				: upgrade.costType ? "Buy for " + format(upgrade.cost(amount)) + " " + getUpgradeCurrencyName(upgrade.costType)
			 	: "Buy for $" + format(upgrade.cost(amount))
		);
	} else if (upgrade.req()) {
		selectedUpgrade = [type, x]
		document.getElementById("upgradeInfo").innerHTML = "<b>" + upgrade.title + "</b><br>" + (
				upgrade.single ? "" 
					: upgrade.effectDisplay(upgrade.effect(amount)) + " -> " + upgrade.effectDisplay(upgrade.effect(amount + 1)) + "<br>"
			) + 
			upgrade.desc;
		document.getElementById("upgradeButton").innerHTML = (
			upgrade.costType
			 	? "Buy for " + format(upgrade.cost(amount)) + " " + getUpgradeCurrencyName(upgrade.costType)
			 	: "Buy for $" + format(upgrade.cost(amount))
		);
	} else {
		selectedUpgrade = 0
		document.getElementById("upgradeInfo").innerHTML = "<b>Locked upgrade</b>"
		document.getElementById("upgradeButton").innerHTML = "Unlocks at " + upgrade.reqDisplay + "!"
	}
	updateUpgrades();
}

function buyUpgrade(type, id) {
	if (!type) [type, id] = selectedUpgrade;
	if (id == "$all") {
		id = getCheapestUpgrade(type);
		console.log(id);
		if (!id) return;
		id = id[0];
	}
	let upgrade = upgrades[type]?.[id];
	if (!upgrade || !upgrade.req()) return;
	let amount = game.upgradesBought[type]?.[id] ?? 0;
	let cost = upgrade.cost(amount);
	let costType = upgrade.costType || "cash";
	if (game[costType] >= cost) {
		game[costType] -= cost;

		updateCurrencies()

		game.upgradesBought[type][id] = (game.upgradesBought[type][id] ?? 0) + 1;

		displayUpgrade(...selectedUpgrade)

		if (type == "normal" && id == 1)         calculateDamage()
		if (type == "normal" && id == 2)         calculateDamage()
		if (type == "normal" && id == 10)        calculateDamage()
		else if (type == "normal" && id == 4)    game.artifactChance = getUpgradeEffect("normal", 4)

		updateUpgrades();

		return true;
	}
}

function getCheapestUpgrade(type) {
	return Object.entries(upgrades[type])
		.filter(x => !x[0].startsWith("$") && (x[1].visible?.() ?? true) && x[1].req())
		.map(([key, item]) => [key, item, item.cost(game.upgradesBought[type]?.[key] ?? 0) / game[item.costType ?? "cash"]])
		.sort((a, b) => a[2] - b[2])[0];
}