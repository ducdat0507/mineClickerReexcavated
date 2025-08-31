

function XPToLevel(x) {return Math.floor((x/5) ** 0.4) + 1} 
function levelToXP(x) {return Math.ceil((x - 1) ** (1/0.4) * 5)} 
function levelToColour(x) {
	const list = ["#7f7", "#8ff", "#faf", "#fc7", "#aaf", "#ff7", "#f88"]
	return list[x % list.length]
}


// Math functions from lootalot

const prefs = {
	MAX_REPEAT: 100
}

function inverseErf(x) {
    const a = 0.1400122886866665;
    const b = Math.log(1 - x ** 2) / a;
    const c = 2 / Math.PI / a + Math.log(1 - x ** 2) / 2;
    return Math.sign(x) * Math.sqrt(Math.sqrt(c ** 2 - b) - c);
}

function probit(p, μ, σ) {
    const sqrt2 = 1.4142135623730951
    return inverseErf(2 * p - 1) * sqrt2 * σ + μ;
}

function coinFlip(n, p) {
    if (p <= 0) return 0;
    if (p >= 1) return n;
    if (n <= prefs.MAX_REPEAT) {
        let successes = 0;
        for (let i = 0; i < n; i++) successes += +(Math.random() < p);
        return successes;
    } else {
        let μ = n * p;
        let σ = Math.sqrt(μ * (1 - p));
        return Math.round(clamp(probit(Math.random(), μ, σ), 0, n));
    }
}

function clamp(x, min, max) {
	return Math.min(Math.max(x, min), max);
}

function doFactors(count, chance, chanceDecay, maxFactor) {
	let factor = 0;
	if (chance > 1) {
		factor = Math.ceil(Math.log(chance) / -Math.log(1 - chanceDecay))
		chance *= (1 - chanceDecay) ** factor;
	}
	let result = {}
	while (count > 0 && factor <= maxFactor) {
		let hits = coinFlip(count, 1 - chance);
		if (hits) result[factor] = hits;
		count -= hits;
		chance *= 1 - chanceDecay;
		factor++;
	}
	if (count != 0) {
		factor--;
		result[factor] ??= 0;
		result[factor] += count;
	}
	return result;
}