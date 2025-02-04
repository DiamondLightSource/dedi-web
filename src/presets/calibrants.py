import os
import shutil
import re
from collections import defaultdict
import json

if not os.path.isfile("CalibrationStandards.java"):
    os.system("git clone https://github.com/DawnScience/scisoft-core.git")
    shutil.move("./scisoft-core/uk.ac.diamond.scisoft.analysis/src/uk/ac/diamond/scisoft/analysis/crystallography/CalibrationStandards.java", "./CalibrationStandards.java")
    shutil.rmtree("./scisoft-core")

calibrants = defaultdict(lambda:[])

def add_new_calibrant(name,current_file):
    line = current_file.readline()
    while "tmp.put(calibrant.getName(), calibrant)" not in line:
        if "calibrant.addHKL(new HKL(" in line:
            positions = {}
            values = re.findall("[\d|\.| ]*,", line)
            positions["d"] = float(values[-1][:-1])
            positions["h"] = 0
            positions["k"] = 0
            positions["l"] = 0
            if len(values) > 3:
                positions["h"] = int(values[0][:-1])
                positions["k"] = int(values[1][:-1])
                positions["l"] = int(values[2][:-1])
            calibrants[name].append(positions)
        line = current_file.readline()


with open("./CalibrationStandards.java", "r") as calibrant_file:
    while line := calibrant_file.readline():
        if "calibrant = new CalibrantSpacing(" in line:
            name = line.split("(\"")[1].split("\")")[0]
            add_new_calibrant(name,calibrant_file)


with open("calibrant.json", "w") as json_file:
    json.dump(calibrants, json_file)

os.system("npx prettier --write .")
