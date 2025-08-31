

function format(x,forceLargeFormat=false) {
	if (x != x) {return x.toLocaleString("en-US")}
	if (!forceLargeFormat && x < 1e6) return Math.floor(x).toLocaleString("en-US");
	
	let exponent = Math.floor(Math.log10(x))

	if (game.numberFormat == "standard") {
		let illionIndex = Math.floor(exponent / 3);
		if (illionsShort[illionIndex-1])
			return formatSig(x/(1000**illionIndex), 5) + " " + illionsShort[illionIndex-1]
	}
	if (game.numberFormat == "standardLong") {
		let illionIndex = Math.floor(exponent / 3);
		if (illions[illionIndex-1])
			return formatSig(x/(1000**illionIndex), 3) + " " + illions[illionIndex-1]
	}
		
	return formatSig(Math.floor(x/(10**exponent)*10000)/10000, 5) + "e" + exponent
}

function formatSig(x, digits = 2) {
	return x.toLocaleString("en-US", {
		minimumSignificantDigits: digits,
		maximumSignificantDigits: digits,
	})
}

function formatWhole(x, digits = 2) {
	return x.toLocaleString("en-US", {
		minimumFractionDigits: digits,
		maximumFractionDigits: digits,
	})
}

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
