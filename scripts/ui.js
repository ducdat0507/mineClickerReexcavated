


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

    messageTime -= delta;
	
	if (game.level >= 5 || game.minerSoulTotal > 0) {
		document.getElementById("upgradeBottomButton").style.color = ""
		document.getElementById("upgradeBottomButton").innerHTML = "UPG"
	} else {
		document.getElementById("upgradeBottomButton").style.color = "#777"
		document.getElementById("upgradeBottomButton").innerHTML = "5"
    }
	if (game.level >= 100 || game.minerSoulTotal > 0) {
		document.getElementById("ascensionBottomButton").style.color = "#60a"
		document.getElementById("ascensionBottomButton").innerHTML = "ASC"
	} else {
		document.getElementById("ascensionBottomButton").style.color = "#777"
		document.getElementById("ascensionBottomButton").innerHTML = "100"
    }
}

function updateCurrencies() {
	document.getElementById("cash").innerHTML = "$" + format(game.cash)
	document.getElementById("upgradeScreenCash").innerHTML = "$" + format(game.cash)

	document.getElementById("ascensionScreenCash").innerHTML = "$" + format(game.ascensionCash)

	document.getElementById("artifacts").innerHTML = format(game.artifacts)
	document.getElementById("upgradeScreenArtifacts").innerHTML = format(game.artifacts)
	document.getElementById("gildingScreenArtifacts").innerHTML = format(game.artifacts)
	document.getElementById("artifactHolder").style.display 
		= document.getElementById("upgradeArtifactHolder").style.display 
		= game.level >= 10 && game.artifacts > 0 ? "" : "none";
	
	document.getElementById("toolScreenCash").innerHTML = getToolCurrency(currentTool)

	document.getElementById("upgradeScreenMinerSouls").innerHTML = format(game.minerSouls)
	document.getElementById("upgradeScreenMinerSoulTotal").innerHTML = format(game.minerSoulTotal)

	if (document.getElementById("upgradeScreen").style.left == "0px") updateUpgrades();
	if (document.getElementById("ascensionScreen").style.left == "0px") updateAscensionGain();
}

function flash(target, color = "#8f8") {
	document.getElementById(target).style.transition = "none"
	document.getElementById(target).style.color = color
	setTimeout(function() {
		document.getElementById(target).style.transition = "color 500ms"
		document.getElementById(target).style.color = ""
	}, 200)
}



var messageTime = 0

function setMessage(x,y) {
	let messageColours = ["#8f8", "#ff8", "#8ff"]
	if (game.messages) {
		document.getElementById("message").style.color = messageColours[x]
		document.getElementById("message").innerHTML = y
		messageTime = 2.5
	}
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
			document.getElementById("reincarnateButton").style.height = (windowHeight * maxAspectRatio * 0.24) + "px"
			document.getElementById("reincarnateButton").style.fontSize = (windowHeight * maxAspectRatio * 0.052) + "px"
			document.getElementById("reincarnationTabButton").style.height = (windowHeight * maxAspectRatio * 0.24) + "px"
			document.getElementById("reincarnationTabButton").style.fontSize = (windowHeight * maxAspectRatio * 0.08) + "px"
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
			document.getElementById("reincarnateButton").style.height = (windowWidth * 0.24) + "px"
			document.getElementById("reincarnateButton").style.fontSize = (windowWidth * 0.052) + "px"
			document.getElementById("reincarnationTabButton").style.height = (windowWidth * 0.24) + "px"
			document.getElementById("reincarnationTabButton").style.fontSize = (windowWidth * 0.08) + "px"
    }
}
window.addEventListener('resize', adjustDivSize);
