

function format(x,forceLargeFormat=false) {
	if (x==Infinity) {return "Infinity"}
	else if (game.numberFormat == "standard" && (forceLargeFormat || x>=1e6)) {
		let exponent = Math.floor(Math.log10(x) / 3)
		return formatSig(x/(1000**exponent), 5) + " " + illionsShort[exponent-1]
	}
	else if (game.numberFormat == "standardLong" && (forceLargeFormat || x>=1e6)) {
		let exponent = Math.floor(Math.log10(x) / 3)
		return formatSig(x/(1000**exponent), 3) + " " + illions[exponent-1]
	}
	else if (game.numberFormat == "scientific" && (forceLargeFormat || x>=1e6)) {
		let exponent = Math.floor(Math.log10(x))
		return formatSig(Math.floor(x/(10**exponent)*10000)/10000, 5) + "e" + exponent
	}
	else return Math.floor(x).toLocaleString("en-US")
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
