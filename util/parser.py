f = open("../static/world.svg")
lines = f.readlines()
names = []
c = 0
while c < len(lines):
    line = lines[c].strip()
    if "data-name" in line:
        names.append(line[11:-1])
    c += 1

print (len(names))
print (names)
