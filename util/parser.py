import csv
# World Map
f = open("../file.js")
lines = f.readlines()
names = []
c = 0
while c < len(lines):
    line = lines[c].strip()
    if "name" in line:
        names.append(line[9:-2])
    c += 1

print (len(names))
# print (names)

# Population data
countries = []
excluded  = []
with open("../data/population.csv") as population:
    table = csv.DictReader(population)
    for row in table:
        if row['name'] in names:
            countries.append(row['name'])
            names.remove(row['name'])
        else:
            excluded.append(row['name'])
names = sorted(names)
excluded = sorted(excluded)
print (len(names))
print (names)
print ("===========================================")
print(len(excluded))
print(excluded)
#print (names.index("Central African Rep."))
# Notes
# two congos in population
a = ["Bahrain", "Holy See", "Kiribati", "Marshall Island", "Micronesia", "Monaco", "Samoa", "San Marino", "Sao Tome and Principe", "St. Lucia", "Tuvalu"]
print(len(a))

b = ["Holy See", "Hong Kong, China", "Liechtenstein", "Montengro", "Palestine", ]
