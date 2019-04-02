import csv
# World Map
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
# print (names)

# Population data
countries = []
excluded  = []
with open("../data/population_1800-2100.csv") as population:
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
print(excluded)
print (names.index("Central African Rep."))
# Notes
# two congos in population
# ["Bahrain", "Holy See", "Kiribati", "Marshall Island", "Micronesia", "Monaco", "Samoa", "San Marino", "Sao Tome and Principe", "St. Lucia", "Tuvalu"]
