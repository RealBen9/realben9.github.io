def getStrFromDict(index):
    #print(index)
    return "." + index
file = open("output/test.js", "r+", encoding='utf8')
fileOut = file.read()
file.close()
fileOut = fileOut.split("\n")
count = 0
finalOut = ""
for x in fileOut:
    fileOut[count] = fileOut[count].split("['")
    if len(fileOut[count]) == 1:
        finalOut = finalOut + fileOut[count][0]
    else:
        for x in range(0,len(fileOut[count])-1):
            if fileOut[count][1][4] == "]":
                dictIndex = fileOut[count][1][:3]
                fileOut[count][0] = fileOut[count][0] + getStrFromDict(dictIndex) + fileOut[count][1][5:]
                fileOut[count].pop(1)
            elif fileOut[count][1][5] == "]":
                dictIndex = fileOut[count][1][:4]
                fileOut[count][0] = fileOut[count][0] + getStrFromDict(dictIndex) + fileOut[count][1][6:]
                fileOut[count].pop(1)
            elif fileOut[count][1][6] == "]":
                dictIndex = fileOut[count][1][:5]
                fileOut[count][0] = fileOut[count][0] + getStrFromDict(dictIndex) + fileOut[count][1][7:]
                fileOut[count].pop(1)
            elif fileOut[count][1][7] == "]":
                dictIndex = fileOut[count][1][:6]
                fileOut[count][0] = fileOut[count][0] + getStrFromDict(dictIndex) + fileOut[count][1][8:]
                fileOut[count].pop(1)
            elif fileOut[count][1][8] == "]":
                dictIndex = fileOut[count][1][:7]
                fileOut[count][0] = fileOut[count][0] + getStrFromDict(dictIndex) + fileOut[count][1][9:]
                fileOut[count].pop(1)
            elif fileOut[count][1][9] == "]":
                dictIndex = fileOut[count][1][:8]
                print(getStrFromDict(dictIndex) + fileOut[count][1][7:])
                fileOut[count][0] = fileOut[count][0] + getStrFromDict(dictIndex) + fileOut[count][1][10:]
                fileOut[count].pop(1)
            else:
                print(fileOut[count][1])
                print(fileOut[count][0])
                raise NotImplementedError
        finalOut = finalOut + fileOut[count][0]
    finalOut = finalOut + "\n"
    count += 1
file = open("output/final.js", "r+", encoding='utf8')
file.write(finalOut)
file.close()
