const oreNames = ["Sand", "Clay", "Chalk", "Stone", "Coal", "Tin", "Copper", "Nickel", "Iron", "Obsidian", "Silver", "Gold", "Platinum", "Titanium", "Iridium", "Malachite", "Topaz", "Lapis lazuli", "Amethyst", "Opal", "Aquamarine", "Sapphire", "Emerald", "Ruby", "Diamond", "Uranium", "Plutonium", "Mythril", "Adamantium", "Kryptonite", "Vibranium", "Neutronium", "Unobtanium", "Dark matter", "Quark soup", "Degenerate matter", "Red matter", "Pentaquark matter", "Strangelet", "Preon matter", "Antimatter", "Small asteroid", "Large asteroid", "Platinum asteroid", "Alien spaceship", "Alien mothership", "Small moon", "Large moon", "Exoplanet", "Ecumenopolis", "Large exoplanet", "Brown dwarf", "Main sequence star", "Hypergiant star", "Nebula", "Black hole", "Small galaxy", "Galaxy", "Large galaxy", "Great void", "Galaxy filaments", "Supercluster", "Small universe", "Large universe", "Light universe", "Neon universe", "Chaos universe", "Gold universe", "Power universe", "Multiverse", "Kiloverse", "Megaverse", "Gigaverse", "Xenoverse", "Ultraverse", "Hyperverse", "Omniverse", "Transcendence"]
const oreValues = [1, 3, 8, 20, 35, 75, 125, 200, 450, 720, 1200, 1800, 2600, 4500, 7200, 11500, 15000, 22500, 33000, 48000, 75000, 115000, 170000, 260000, 450000, 720000, 1.1e6, 1.6e6, 2.5e6, 3.8e6, 6e6, 9.5e6, 1.5e7, 2.35e7, 3.6e7, 6e7, 9.5e7, 1.6e8, 2.5e8, 3.9e8, 6.25e8, 1.1e9, 1.8e9, 3e9, 5e9, 8.25e9, 1.45e10, 2.6e10, 4.5e10, 7.2e10, 1.3e11, 2.2e11, 3.5e11, 6e11, 1e12, 1.8e12, 3e12, 5.2e12, 9e12, 1.55e13, 2.6e13, 5e13, 8.25e13, 1.4e14, 2.4e14, 4.2e14, 7.5e14, 1.35e15, 2.5e15, 4.5e15, 7.25e15, 1.3e16, 2.4e16, 4.5e16, 7.4e16, 1.25e17, 2.1e17, 7.7777e17]
const oreHitPoints = [10, 25, 60, 110, 180, 250, 380, 600, 900, 1250, 1700, 2400, 3200, 4400, 6000, 8500, 11000, 14500, 20000, 27500, 36000, 46000, 64000, 88000, 110000, 145000, 200000, 275000, 370000, 510000, 740000, 1.05e6, 1.6e6, 2.4e6, 3.6e6, 5.25e6, 7.5e6, 1.2e7, 1.75e7, 2.55e7, 3.8e7, 5.75e7, 8e7, 1.25e8, 1.8e8, 2.8e8, 4.25e8, 6.5e8, 1e9, 1.5e9, 2.2e9, 3.4e9, 5e9, 7.75e9, 1.15e10, 1.6e10, 2.35e10, 3.5e10, 5.2e10, 7.8e10, 1.2e11, 1.9e11, 3.4e11, 5.2e11, 7.75e11, 1.2e12, 1.8e12, 2.8e12, 4.5e12, 6.6e12, 1e13, 1.6e13, 2.35e13, 3.6e13, 5.5e13, 8.4e13, 1.25e14, 1e15]
const oreHardnesses = [0, 0, 1, 2, 3, 5, 8, 14, 22, 35, 48, 65, 90, 125, 170, 225, 280, 360, 525, 700, 1150, 1500, 2100, 2600, 3200, 4500, 6000, 8800, 12000, 17500, 25000, 33500, 42000, 52000, 74000, 105000, 145000, 250000, 360000, 525000, 750000, 1.2e6, 1.75e6, 2.6e6, 3.6e6, 5.5e6, 9e6, 1.3e7, 2.1e7, 3.2e7, 4.5e7, 7e7, 1.1e8, 1.6e8, 2.4e8, 3.3e8, 5e8, 7.2e8, 1.15e9, 1.6e9, 2.5e9, 4e9, 7e9, 1.05e10, 1.6e10, 2.5e10, 3.8e10, 6e10, 1e11, 1.4e11, 2.25e11, 3.2e11, 5e11, 7.5e11, 1.2e12, 1.75e12, 2.6e12, 4e12]

const layerNames = ["Shallow layer", "Central layer", "Deep layer", "Mantle layer", "Core layer", "Outer space", "Interstellar space", "Intergalactic space", "The multiverse", "Outer reality", "Transcendence"]
const layerPoints = [1, 9, 16, 26, 34, 42, 49, 57, 63, 70, 78, Infinity]

const toolNames = ["Shovel", "Pickaxe", "Rusty drill", "Stone drill", "Copper drill", "Iron drill", "Steel drill", "Golden drill", "Titanium drill", "Emerald drill", "Ruby drill", "Diamond drill", "Mythril drill", "Adamantium drill", "Vibranium drill", "Unobtanium drill", "Dark matter drill", "Antimatter drill", "Blue laser drill", "Green laser drill", "Red laser drill", "White laser drill", "Dark laser drill", "Antilaser drill"]
const toolDamages = [1, 3, 8, 20, 40, 75, 130, 250, 450, 700, 1300, 2500, 4500, 8000, 15000, 27500, 52000, 95000, 180000, 350000, 660000, 1.25e6, 2.4e6, 4.5e6, 8.5e6, 1.6e7, 3e7, 5.6e7, 1.05e8, 2e8, 3.5e8, 6.5e8, 1.2e9]
const toolCosts = [10, 60, 300, 2000, 10000, 80000, 400000, 5e6, 2.5e7, 1.5e8, 7.5e8, 3e9, 2e10, 2.5e11, 3.75e12, 7.5e13, 2.5e15, 7.5e16, 3e18, 1e20, 2e22, 3.1e24, 5e26, 1e29, 3e31, 5e33, 1e36, 5e38, 1e41, 1e44, 1e47, 1e50]

const compNames = ["Miner rock", "Miner dog", "Miner gnome", "Miner human", "Buffed miner", "Mining couple", "Mining triplet", "Mining team", "Mining machine", "Miner dragon", "Mining factory", "Mining corporation", "Mining town", "Mining county", "Mining country", "Mining planet"]
const compDamages = [1, 3, 6, 10, 16, 25, 40, 60, 75, 100, 130, 160, 200, 250, 300, 360, 420]
const compCosts = [1, 25, 100, 400, 1600, 3200, 6400, 15000, 45000, 15000, 60000, 300000, 1e6, 6.6e6, 7.7e7, 1e9]

const illions = ["thousand", "million", "billion", "trillion", "quadrillion", "quintillion", "sextillion", "septillion", "octillion", "nonillion", "decillion", "undecillion", "duodecillion", "tredecillion", "quattuordecillion", "quindecillion", "sexdecillion", "septendecillion", "octodecillion", "novemdecillion", "vigintillion"]
const illionsShort = ["K", "M", "B", "T", "Qa", "Qt", "Sx", "Sp", "Oc", "No", "Dc", "UDc", "DDc", "TDc", "QaDc", "QiDc", "SxDc", "SpDc", "OcDc", "NoDc", "Vg"]