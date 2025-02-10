import os
import re
import json

if not os.path.isfile("CalibrationStandards.java"):
    os.system("wget https://raw.githubusercontent.com/DawnScience/scisoft-core/refs/heads/master/uk.ac.diamond.scisoft.analysis/src/uk/ac/diamond/scisoft/analysis/crystallography/CalibrationStandards.java")

calibrants = {}

def add_new_calibrant(name, current_file):
    line = current_file.readline()
    positions = []
    while "tmp.put(calibrant.getName()" not in line:
        if "calibrant.addHKL(new HKL(" in line:
            values = re.findall("[\d|\.| ]*,", line)
            d_value = float(values[-1][:-1])
            if "ANGSTROM" in line : d_value /= 10
            positions.append(d_value)
        line = current_file.readline()
    calibrants[name] = ({"d":positions})


with open("./CalibrationStandards.java", "r") as calibrant_file:
    while True:
        line = calibrant_file.readline()
        if not line : break
        
        if "calibrant = new CalibrantSpacing(" in line:
            name = line.split("(\"")[1].split("\")")[0]
            add_new_calibrant(name,calibrant_file)

print(calibrants)
with open("calibrant.json", "w") as json_file:
    json.dump(calibrants, json_file)

