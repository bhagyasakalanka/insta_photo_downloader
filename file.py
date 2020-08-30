import os, sys
import csv

def renameFile(startCount):
    count = startCount
    for file in os.listdir(os.getcwd()):
        count += 1
        try:
            exte = file.split(".")[1]
            os.rename(file, str(count)+"."+exte)
        except:
            print("error")



def writeCSV(colorset):
    
    with open(os.getcwd()+'/test.csv', "w", newline='') as file:
        fieldnames = ["id", "color"]
        writer = csv.DictWriter(file, fieldnames= fieldnames)
        writer.writeheader()
        count = 0
        for i in colorset:
            for j in range(500):
                count += 1
                writer.writerow({"id":count, "color":i})
        

#renameFile(500)
writeCSV(["black","white","yellow"])
