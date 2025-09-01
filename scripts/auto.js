let autoUpgradeTime = 0;

let autoFunctions = {
    "advance": {
        name: "Auto advance ores",
        unlocked: () => game.minerSoulTotal >= 1e4,
        unlockText: () => format(1e4) + " miner's souls"
    },
    "upgrade": {
        name: "Auto buy upgrades",
        unlocked: () => game.minerSoulTotal >= 1e5,
        unlockText: () => format(1e5) + " miner's souls"
    },
    "artifact": {
        name: "Auto use artifacts",
        unlocked: () => game.minerSoulTotal >= 1e6,
        unlockText: () => format(1e6) + " miner's souls"
    },
    "comp": {
        name: "Auto upgrade companions",
        unlocked: () => game.minerSoulTotal >= 1e7,
        unlockText: () => format(1e7) + " miner's souls"
    },
    "tool": {
        name: "Auto upgrade tools",
        unlocked: () => game.minerSoulTotal >= 1e8,
        unlockText: () => format(1e8) + " miner's souls"
    },
}

function showAutoScreen() {
    document.getElementById("autoScreen").style.left = "0";
    updateAutoScreen();
}

function hideAutoScreen() {
    document.getElementById("autoScreen").style.left = "-100%";
}

function toggleAuto(id) {
    game.auto[id] = !game.auto[id];
    updateAutoScreen();
}

function updateAutoScreen() {
    for (const item in autoFunctions) {
        let data = autoFunctions[item];
        if (!data.element) {
            data.element = document.createElement("div");
            data.element.classList.add("thickButton");
            data.element.onclick = () => { if (data.unlocked()) toggleAuto(item); }
            document.getElementById("autoButtons").append(data.element);
        }

        let unlocked = data.unlocked();
        data.element.innerHTML = unlocked
            ? `${data.name}: ${game.auto[item] ? "ON" : "OFF"}` 
            : `Reach ${data.unlockText()}`;
        data.element.style.color = unlocked ? "" : "#777";
    }
}