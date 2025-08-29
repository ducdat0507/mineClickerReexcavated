

function XPToLevel(x) {return Math.floor((x/5) ** 0.4) + 1} 
function levelToXP(x) {return Math.ceil((x - 1) ** (1/0.4) * 5)} 
function levelToColour(x) {
	return ["#7f7", "#8ff", "#ccf", "#ff7", "#f88"][Math.min(x, 5)]
}