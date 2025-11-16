strDict = ["xVZpt", "VwDmv", "AgeiL", "zSkGS", "sQBOC", "hashes", "lEQkT", "postMessage", "substring", "width", "YOkcx", "data", "mmNXr", "PYdEQ", "fill", "CshoZ", "split", "document", "#809900", "WwmsS", "fxveG", "pEqWf", "fillStyle", "#4D8066", "giWWK", "dvZJa", "wzaKe", "ekOfI", "bezierCurveTo", "DRhxa", "IwKMw", "params", "#E666FF", "toBlob", "timing", "#E6FF80", "arc", "#CCFF1A", "#3366E6", "#66991A", "bJDPi", "fromCharCode", "aXzsT", "BNvCR", "#CC9999", "CzJLP", "hello", "RjtPt", "#33FFCC", "UGDWB", "EfgvV", "0123456789abcdef", "pHAEm", "oibcj", "font", "vbqTE", "SwVgE", "#E64D66", "RLihy", "Zpyoj", "eozFd", "WDfUk", "min", "text", "cWjkD", "Qnrub", "GjnZc", "tJRqP", "ucgpn", "lPQqo", "performance", "UeUOG", "#B34D4D", "DmRFY", "znEIp", "#66994D", "DTPkk", "undefined", "1|6|4|5|3|0|2", "kTHsX", "ifWtq", "wLFxu", "#991AFF", "shadowColor", "#999933", "QBSUU", "length", "addColorStop", "getContext", "EgcCU", "beginPath", "#F38020", "DIwvg", "HAhKp", "all", "#E6B3B3", "LMUAE", "phtvy", "MKyfq", "RmFPv", "rtBvD", "#809980", "quadraticCurveTo", "srDZA", "Lksch", "#80B300", "EpiNQ", "#66664D", "#FAAE40", "CmZXv", "AWaAv", "xQbmj", "EPkNa", "JqbVb", "UbDSn", "CSCJh", "strokeText", "#99FF99", "#FFB399", "#FF6633", "#6666FF", "jdfms", "HCdfy", "10|12|2|7|9|14|0|13|3|1|8|6|4|5|11", "TkTOX", "#1AB399", "FVSxQ", "BtkIC", "SFXGe", "canvas", "results", "#99E6E6", "DBvHZ", "#999966", "xUCIK", "now", "fAzGH", "#B3B31A", "sqBHg", "BxQAH", "toDataURL", "XiLqI", "onmessage", "nkjGo", "YFysJ", "obBcf", "moveTo", "BntOL", "XnNdt", "CanvasRenderingContext2D", "#66E64D", "Mvndi", "VhdaA", "10|3|6|8|7|0|9|5|1|4|2|11", "#FF4D4D", "eghbK", "vYGJb", "#E6331A", "OTRoe", "#E666B3", "#B33300", "vsEvE", "charCodeAt", "fhRvN", "#4DB3FF", "xVcKe", "zsGCN", "Buznc", "fceKw", "shadowBlur", "createRadialGradient", "aiRPz", "WplYu", "fillText", "ZOnqr", "join", "Zhfxm", "oGfTI", "#00B3E6", "IpVtm", "CwNWT", "then", "#33991A", "round", "xnQTS", "#E6B333", "unknown", "wyonn", "convertToBlob", "#00E680", "kVOeB", "blAyw", "pxsVZ", "XBbFQ", "#4D80CC", "spWEF", "KlOOt", "frgzy", "#CCCC00", "floor", "map", "ywFRb", "tnlGg", "#4DB380", "SOelW", "#FF3380", "HODer", "OWNYu", "ZOCRD", "DTzMD", "DBCGi", "dpvXa", "gpitG", "height", "plxrs", "#FFFF99", "UBcNX", "jCUOP", "ldwvU", "ellipse", "max", "#CC80CC", "#FF99E6", "px aanotafontaa", "BQnDS", "vzPeQ", "JOUMH", "Jhsrp", "#FF1A66", "dCkTH", "PzTKd", "yjjtW", "sWHWn", "KkDDv", "wFkif", "WgcDK", "stroke", "wpfwb", "Adwxm", "WWRlp", "LUAOL", "push", "#4D8000", "#FF33FF", "#1AFF33", "DCINJ", "executionTime", "RKJpA", "zHuzl", "11|5|61|49|59|12|65|15|39|44|9|40|38|19|62|22|48|3|0|56|1|64|29|36|17|47|55|23|10|30|66|42|26|8|60|35|68|24|25|63|6|57|67|33|28|27|13|18|53|34|58|37|51|4|50|16|32|21|54|52|45|20|2|7|46|43|41|14|31", "NFdDl", "ebitP", "getTime", "pWdKU", "pTHzF", "#9900B3", "#B366CC", "OrDhT", "#6680B3"]
def getStrFromDict(index):
    count = 0
    strOut = strDict[index]
    strOut = list(strOut)
    for x in strOut:
        if strOut[count] == "'":
            strOut[count] = "\\" + strOut[count]
        count += 1
    strOut = "'" + "".join(strOut) + "'"
    return strOut
file = open("output/test.js", "r+", encoding='utf8')
fileOut = file.read()
file.close()
fileOut = fileOut.split("\n")
count = 0
finalOut = ""
for x in fileOut:
    fileOut[count] = fileOut[count].split("b('")
    if len(fileOut[count]) == 1:
        finalOut = finalOut + fileOut[count][0]
    else:
        for x in range(0,len(fileOut[count])-1):
            if fileOut[count][1][4] == ")":
                dictIndex = fileOut[count][1][:3].strip("'")
                fileOut[count][0] = fileOut[count][0] + getStrFromDict(int(dictIndex,0)) + fileOut[count][1][5:]
                fileOut[count].pop(1)
            elif fileOut[count][1][5] == ")":
                dictIndex = fileOut[count][1][:4].strip("'")
                fileOut[count][0] = fileOut[count][0] + getStrFromDict(int(dictIndex,0)) + fileOut[count][1][6:]
                fileOut[count].pop(1)
            else:
                dictIndex = fileOut[count][1][:5].strip("'")
                fileOut[count][0] = fileOut[count][0] + getStrFromDict(int(dictIndex,0)) + fileOut[count][1][7:]
                fileOut[count].pop(1)
        finalOut = finalOut + fileOut[count][0]
    finalOut = finalOut + "\n"
    count += 1
file = open("output/final.js", "r+", encoding='utf8')
file.write(finalOut)
file.close()
