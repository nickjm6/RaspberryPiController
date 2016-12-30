import sys

types = [
	'Normal',
	'Fighting',
	'Flying',
	'Poison',
	'Ground',
	'Rock',
	'Bug', 
	'Ghost',
	'Steel',
	'Fire',
	'Water',
	'Grass',
	'Electric',
	'Psychic',
	'Ice',
	'Dragon',
	'Dark',
	'Fairy'
]

filename = sys.argv[1]
pokefile = open(filename)
pokemon = {}
for line in pokefile:
	arr = line.split()
	name = arr[0].lower()
	typesArr = []
	for i in range(1, len(arr)):
		type = arr[i]
		if type not in types:
			name += " %s" % type.lower()
		else:
			typesArr.append(type)
	pokemon[name] = typesArr

temp = []
resArr = []

resistances = [
	'11111-10-111111111',
	'+1--1+-0+1111-+1+-',
	"1+111-+1-11+-11111",
	"111---1-011+11111+",
	"110+1+-1++1-+11111",
	"1-+1-1+1-+1111+111",
	"1---111---1+1+11+-",
	"0111111+11111+11-1",
	"11111+11---1-1+11+",
	"11111-+1+--+11+-11",
	"1111++111+--111-11",
	"11--++-1--+-111-11",
	"11+1011111+--11-11",
	"1+1+1111-1111-1101",
	"11+1+111---+11-+11",
	"11111111-111111+10",
	"1-11111+11111+11--",
	"1+1-1111--11111++1"
]

for line in resistances:
	temp.append(list(line))
	resArr.append(list(line))

for r in range(18):
	for c in range(18):
		resArr[r][c] = temp[c][r]



def getFacts(typeArr):
	weak = []
	resist = []
	noEffect = []
	doubleWeak = []
	doubleResist = []
	for t in typeArr:
		i = types.index(t)
		for j in range(18):
			c = resistances[j][i]
			if c == "-":
				resist.append(types[j])
			elif c == "+":
				weak.append(types[j])
			elif c == "0":
				noEffect.append(types[j])

	for w in weak:
		if w in resist and w in weak:
			resist.remove(w)
			weak.remove(w)
		if w in noEffect and w in weak:
			weak.remove(w)
		if weak.count(w) == 2:
			doubleWeak.append(w)
			while w in weak:
				weak.remove(w)

	for r in resist:
		if r in noEffect and r in resist:
			resist.remove(r)
		if resist.count(r) == 2:
			doubleResist.append(r)
			while r in resist:
				resist.remove(r)
	facts = {}
	facts["doubleWeak"] = ["super weak against: ", doubleWeak]
	facts["weak"] = ["weak against: ", weak]
	facts["resist"] = ["resistant against: ", resist]
	facts["doubleResist"] = ["super resistant against: ", doubleResist]
	facts["noEffect"] = ["not affected by: ", noEffect]
	return facts

name = sys.argv[2]

if name in pokemon:
	typesArr = pokemon[name]
	print "%s: %s" % (name, ", ".join(typesArr))
	facts = getFacts(typesArr)
	for fact in facts:
		f = facts[fact]
		if f[1] == []:
			print f[0] + "none"
		else:
			print f[0] + ", ".join(f[1])
else:
	print "Please enter a valid pokemon"