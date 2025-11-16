useCheckerboard = false
multipleMode = false
liarMode = false
negationMode = false
moduloMode = false
unaryMode = false
minicrossMode = false
minesWidth = 16
minesHeight = 13
function modeToggle(type) {
  button = document.getElementById("btn" + type)
  switch (type) {
    case 'M':
      multipleMode = !multipleMode
      button.style.backgroundColor = multipleMode == true ? "#0f0" : "#f00"
      break
    case 'L':
      liarMode = !liarMode
      button.style.backgroundColor = liarMode == true ? "#0f0" : "#f00"
      break
    case 'N':
      negationMode = !negationMode
      button.style.backgroundColor = negationMode == true ? "#0f0" : "#f00"
      break
    case '2M':
      moduloMode = !moduloMode
      button.style.backgroundColor = moduloMode == true ? "#0f0" : "#f00"
      break
    case 'U':
      unaryMode = !unaryMode
      button.style.backgroundColor = unaryMode == true ? "#0f0" : "#f00"
      break
    case 'Xp':
      minicrossMode = !minicrossMode
      button.style.backgroundColor = minicrossMode == true ? "#0f0" : "#f00"
      break
  }
}
var query = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&')
for (let i = 0; i < query.length; i++) {
  if (query[i].toLowerCase().slice(0,11) == "mineswidth=") {
    minesWidth = query[i].toLowerCase().slice(11)-0
  }
  else if (query[i].toLowerCase().slice(0,12) == "minesheight=") {
    minesHeight = query[i].toLowerCase().slice(12)-0
  }
}
noOfMines = 20
noOfDoubleMines = 10
noOfTripleMines = 0
potency = 2
gameStarted = false
firstMove = true
alive = true
seconds = 0
bestTime = 99999
flags = 0
timer = null

gridNums = []
gridNums.length = minesWidth * minesHeight
gridNums.fill(0, 0, gridNums.length)

document.addEventListener('contextmenu', event => event.preventDefault())

function createMines() {
  for (i=0;i<noOfMines;i) {
    randomLocation = Math.floor(Math.random() * (minesWidth * minesHeight))
    if (gridNums[randomLocation] == 0) {
      gridNums[randomLocation] = 1
      if (unaryMode == true) {
        if (gridNums[randomLocation - minesWidth] != undefined) gridNums[randomLocation - minesWidth] = -999
        if ((gridNums[randomLocation - 1] != undefined) && randomLocation % minesWidth != 0) gridNums[randomLocation - 1] = -999
        if ((gridNums[randomLocation + 1] != undefined) && randomLocation % minesWidth != minesWidth - 1) gridNums[randomLocation + 1] = -999
        if (gridNums[randomLocation + minesWidth] != undefined) gridNums[randomLocation + minesWidth] = -999
      }
      i++
    }
  }
  for (i=0;i<noOfDoubleMines;i) {
    randomLocation = Math.floor(Math.random() * (minesWidth * minesHeight))
    if (gridNums[randomLocation] == 0) {
      gridNums[randomLocation] = 2
      if (unaryMode == true) {
        if (gridNums[randomLocation - minesWidth] != undefined) gridNums[randomLocation - minesWidth] = -999
        if ((gridNums[randomLocation - 1] != undefined) && randomLocation % minesWidth != 0) gridNums[randomLocation - 1] = -999
        if ((gridNums[randomLocation + 1] != undefined) && randomLocation % minesWidth != minesWidth - 1) gridNums[randomLocation + 1] = -999
        if (gridNums[randomLocation + minesWidth] != undefined) gridNums[randomLocation + minesWidth] = -999
      }
      i++
    }
  }
  for (i=0;i<noOfTripleMines;i) {
    randomLocation = Math.floor(Math.random() * (minesWidth * minesHeight))
    if (gridNums[randomLocation] == 0) {
      gridNums[randomLocation] = 3
      if (unaryMode == true) {
        if (gridNums[randomLocation - minesWidth] != undefined) gridNums[randomLocation - minesWidth] = -999
        if ((gridNums[randomLocation - 1] != undefined) && randomLocation % minesWidth != 0) gridNums[randomLocation - 1] = -999
        if ((gridNums[randomLocation + 1] != undefined) && randomLocation % minesWidth != minesWidth - 1) gridNums[randomLocation + 1] = -999
        if (gridNums[randomLocation + minesWidth] != undefined) gridNums[randomLocation + minesWidth] = -999
      }
      i++
    }
  }
  for (i=0;i<gridNums.length;i++) {
    if (gridNums[i] == -999) {gridNums[i] = 0}
  }
}

createMines()

function createGame() {
  document.getElementsByClassName("number2")[0].style.display = "none"
  noOfMines = Math.min(parseInt(document.getElementById("noOfMines").value), 207)
  noOfDoubleMines = Math.min(parseInt(document.getElementById("noOfDoubleMines").value), 207 - noOfMines)
  noOfTripleMines = Math.min(parseInt(document.getElementById("noOfTripleMines").value), 207 - noOfMines - noOfDoubleMines)
  document.getElementById("mineDensity").innerHTML = Math.round((noOfMines + noOfDoubleMines + noOfTripleMines) / (minesWidth * minesHeight / 10000)) / 100 + "%"
  if (multipleMode == true || negationMode == true) {useCheckerboard = true}
  else {useCheckerboard = false}
  modified = false
  titleInfo = []
  descriptionInfo = []
  if (multipleMode == true) {modified=true;titleInfo.push("[M]");descriptionInfo.push("[M] Multiple : The value of each mine in a light cell is doubled (Mine count is unaffected by this rule)")}
  if (liarMode == true) {modified=true;titleInfo.push("[L]");descriptionInfo.push("[L] Liar : Each number (except for the mine count) is off by 1")}
  if (negationMode == true) {modified=true;titleInfo.push("[N]");descriptionInfo.push("[N] Negation : Numbers show the difference between adjacent light mines & adjacent dark mines")}
  if (moduloMode == true) {modified=true;titleInfo.push("[2M]");descriptionInfo.push("[2M] Modulo : Each number (except for the mine count) is the remainder of adjacent mines divided by 3")}
  if (unaryMode == true) {modified=true;titleInfo.push("[U]");descriptionInfo.push("[U] Unary : Mines are never orthogonally adjacent")}
  if (minicrossMode == true) {modified=true;titleInfo.push("[X']");descriptionInfo.push("[X'] Mini Cross : Numbers show the amount of mines in a cross region within distance 1")}
  if (useCheckerboard == true) {titleInfo.push("[@c]");descriptionInfo.push("[@c] Checkerboard colouring : This board is checkerboard coloured")}
  if (modified == false) {titleInfo.push("[V]");descriptionInfo.push("[V] Vanilla : Nothing special here (besides the double & triple mines)")}
  document.getElementById("title").innerHTML = titleInfo.join("") + " KiloSweep"
  if (noOfTripleMines > 0) {
    potency = 3
    document.getElementById("size").innerHTML = minesWidth + "x" + minesHeight + "/" + noOfMines + "+(" + noOfDoubleMines + "*2)" + "+(" + noOfTripleMines + "*3)"
    document.getElementById("minefield").style.backgroundImage = "linear-gradient(315deg, #e2e, #2ee)"
    document.getElementById("minefield").style.display = ""
  }
  else if (noOfDoubleMines > 0) {
    potency = 2
    document.getElementById("size").innerHTML = minesWidth + "x" + minesHeight + "/" + noOfMines + "+(" + noOfDoubleMines + "*2)"
    document.getElementById("minefield").style.backgroundImage = "linear-gradient(135deg, #e2e, #2ee)"
    document.getElementById("minefield").style.display = ""
  }
  else if (noOfMines > 0) {
    potency = 1
    document.getElementById("size").innerHTML = minesWidth + "x" + minesHeight + "/" + noOfMines
    document.getElementById("minefield").style.backgroundImage = "linear-gradient(#666, #666)"
    document.getElementById("minefield").style.display = ""
  }
  else {
    potency = 0
    document.getElementById("minefield").style.display = "none"
  }
  if (potency == 1) {document.getElementById("modifierID").innerHTML = "ID : " + titleInfo.join("") + minesHeight + "x" + minesWidth + "-" + noOfMines}
  else if (potency == 2) {document.getElementById("modifierID").innerHTML = "ID : " + titleInfo.join("") + minesHeight + "x" + minesWidth + "-" + noOfMines + "+(" + noOfDoubleMines + "*2)"}
  else {document.getElementById("modifierID").innerHTML = "ID : " + titleInfo.join("") + minesHeight + "x" + minesWidth + "-" + noOfMines + "+(" + noOfDoubleMines + "*2)" + "+(" + noOfTripleMines + "*3)"}
  document.getElementById("description").innerHTML = '<center><h1 style="color:#bbb;margin:8px">Active Modifiers</h1><p style="color:#bbb;margin:8px">' + descriptionInfo.join('</p><hr><p style="color:#bbb;margin:8px">') + '</center>'
  
  if (gameStarted == true) {
    for (i=0;i<(minesWidth * minesHeight);i++) {
      document.getElementById(i).remove()
    }
    gridNums.fill(0, 0, gridNums.length)
    createMines()
  }
  gameStarted = true
  alive = true
  firstMove = true
  seconds = 0
  flags = 0
  if (timer) {
    clearTimeout(timer)
    timer = null;
  }
  document.getElementsByClassName("number")[0].src = "img/Number0.png"
  document.getElementsByClassName("number")[1].src = "img/Number3.png"
  document.getElementsByClassName("number")[2].src = "img/Number0.png"
  document.getElementsByClassName("number")[3].src = "img/Number0.png"
  document.getElementsByClassName("number")[4].src = "img/Number0.png"
  document.getElementsByClassName("number")[5].src = "img/Number0.png"
  document.getElementById("face").src = "img/faceHappy.png"
  document.getElementById("game").style.width = (16 * minesWidth + 18) + "px"
  document.getElementById("game").style.height = (16 * minesHeight + 60) + "px"
  document.getElementById("minefield").style.width = (16 * minesWidth) + "px"
  document.getElementById("minefield").style.height = (16 * minesHeight) + "px"
  document.getElementById("header").style.width = (16 * minesWidth + 2) + "px"
  document.getElementsByClassName("number")[0].src = "img/Number" + Math.floor((noOfMines + noOfDoubleMines * 2 + noOfTripleMines * 3) / 100) + ".png"
  document.getElementsByClassName("number")[1].src = "img/Number" + Math.floor(((noOfMines + noOfDoubleMines * 2 + noOfTripleMines * 3) / 10) % 10) + ".png"
  document.getElementsByClassName("number")[2].src = "img/Number" + ((noOfMines + noOfDoubleMines * 2 + noOfTripleMines * 3) % 10) + ".png"
  let mine = document.createElement("img")
  mine.src = "img/TileUnclicked.png"
  mine.style.display = "block"
  mine.style.float = "left"
  mine.className += "mine"
  mine.draggable = "false"
  mines = document.getElementsByClassName("mine");
  for (i=0;i<(minesWidth * minesHeight);i++) { 
    document.getElementById("minefield").appendChild(mine.cloneNode(true))
    mines[i].setAttribute("id", i)
    mines[i].setAttribute('draggable', false)
    mines[i].setAttribute("data-clicked", "false")
    mines[i].setAttribute("data-flagtype", "0")
    mines[i].addEventListener('click', function(){
      if (alive == true) {clickMine(parseInt(this.id));hideChord(parseInt(this.id));showChord(parseInt(this.id))}
    })
    mines[i].addEventListener('auxclick', function(e){
      if (e.button == 1 && alive == true) {clickMine(parseInt(this.id));hideChord(parseInt(this.id));showChord(parseInt(this.id))}
    })
    mines[i].addEventListener('contextmenu', function(){
      if (alive == true) {flagMine(parseInt(this.id))}
    })
    mines[i].addEventListener('mouseenter', function(){
      if (alive == true) {showChord(parseInt(this.id))}
    })
    mines[i].addEventListener('mouseleave', function(){
      if (alive == true) {hideChord(parseInt(this.id))}
    })
  }
  if (useCheckerboard == true) {createCheckerboard()}
}

function createCheckerboard() {
  mines = document.getElementsByClassName("mine");
  for (i=0;i<(minesWidth * minesHeight);i++) { 
    if (i % 2 == 0 ^ Math.floor(i/minesWidth) % 2 == 1) {mines[i].style.filter = "brightness(0.5)"}
    else {mines[i].style.filter = "brightness(2)"}
  }
}

createGame()

Mousetrap.bind('r', createGame);

function clickMine(x, testable=true) {
  if (alive && mines[x].dataset.clicked == "false" && mines[x].dataset.flagtype <= 0) {
    mines[x].setAttribute("data-clicked", "true")
    //Kills the player if they clicked a mine
    if (firstMove) {
      if (gridNums[x]) {
        movedMine = gridNums[x]
        gridNums[x] = 0
        moveLoc = Math.floor(Math.random() * gridNums.length)
        while (gridNums[moveLoc] > 0) {
          moveLoc = Math.floor(Math.random() * gridNums.length)
        }
        gridNums[moveLoc] = movedMine
      }
    }
    if (gridNums[x]) {die(x)}
    else {  
      firstMove = false
      if (mines[x].dataset.flagtype == "-0") {mines[x].setAttribute("data-flagtype", 0)}

      //Tallies up the total number of mines in the surrounding 8 squares
      minesNearby = 0
      darkMines = 0
      lightMines = 0
      if (minicrossMode == false && gridNums[x - minesWidth - 1] && x % minesWidth != 0) minesNearby += gridNums[x - minesWidth - 1]
      if (gridNums[x - minesWidth]) minesNearby += gridNums[x - minesWidth]
      if (minicrossMode == false && gridNums[x - minesWidth + 1] && x % minesWidth != minesWidth - 1) minesNearby += gridNums[x - minesWidth + 1]
      if (gridNums[x - 1] && x % minesWidth != 0) minesNearby += gridNums[x - 1]
      if (gridNums[x + 1] && x % minesWidth != minesWidth - 1) minesNearby += gridNums[x + 1]
      if (minicrossMode == false && gridNums[x + minesWidth - 1] && x % minesWidth != 0) minesNearby += gridNums[x + minesWidth - 1]
      if (gridNums[x + minesWidth]) minesNearby += gridNums[x + minesWidth]
      if (minicrossMode == false && gridNums[x + minesWidth + 1] && x % minesWidth != minesWidth - 1) minesNearby += gridNums[x + minesWidth + 1]
      
      if (useCheckerboard == true || useCheckerboard == false) {
        if (minicrossMode == false && gridNums[x - minesWidth - 1] && x % minesWidth != 0) {
          if ((x - minesWidth - 1) % 2 == 0 ^ Math.floor((x - minesWidth - 1)/minesWidth) % 2 == 1) {darkMines += gridNums[x - minesWidth - 1]}
          else {lightMines += gridNums[x - minesWidth - 1]}
        }
        if (gridNums[x - minesWidth]) {
          if ((x - minesWidth) % 2 == 0 ^ Math.floor((x - minesWidth)/minesWidth) % 2 == 1) {darkMines += gridNums[x - minesWidth]}
          else {lightMines += gridNums[x - minesWidth]}
        }
        if (minicrossMode == false && gridNums[x - minesWidth + 1] && x % minesWidth != minesWidth - 1) {
          if ((x - minesWidth + 1) % 2 == 0 ^ Math.floor((x - minesWidth + 1)/minesWidth) % 2 == 1) {darkMines += gridNums[x - minesWidth + 1]}
          else {lightMines += gridNums[x - minesWidth + 1]}
        }
        if (gridNums[x - 1] && x % minesWidth != 0) {
          if ((x - 1) % 2 == 0 ^ Math.floor((x - 1)/minesWidth) % 2 == 1) {darkMines += gridNums[x - 1]}
          else {lightMines += gridNums[x - 1]}
        }
        if (gridNums[x + 1] && x % minesWidth != minesWidth - 1) {
          if ((x + 1) % 2 == 0 ^ Math.floor((x + 1)/minesWidth) % 2 == 1) {darkMines += gridNums[x + 1]}
          else {lightMines += gridNums[x + 1]}
        }
        if (minicrossMode == false && gridNums[x + minesWidth - 1] && x % minesWidth != 0) {
          if ((x + minesWidth - 1) % 2 == 0 ^ Math.floor((x + minesWidth - 1)/minesWidth) % 2 == 1) {darkMines += gridNums[x + minesWidth - 1]}
          else {lightMines += gridNums[x + minesWidth - 1]}
        }
        if (gridNums[x + minesWidth]) {
          if ((x + minesWidth) % 2 == 0 ^ Math.floor((x + minesWidth)/minesWidth) % 2 == 1) {darkMines += gridNums[x + minesWidth]}
          else {lightMines += gridNums[x + minesWidth]}
        }
        if (minicrossMode == false && gridNums[x + minesWidth + 1] && x % minesWidth != minesWidth - 1) {
          if ((x + minesWidth + 1) % 2 == 0 ^ Math.floor((x + minesWidth + 1)/minesWidth) % 2 == 1) {darkMines += gridNums[x + minesWidth + 1]}
          else {lightMines += gridNums[x + minesWidth + 1]}
        }
      }
      
      if (minesNearby > 0) {
        if (multipleMode == true) {lightMines *= 2}
        if (liarMode == true) {
          randSel = Math.floor(Math.random() * 2)
          if (randSel == 0) {
            randLie = Math.floor(Math.random() * 2)
            if (randLie == 0 || lightMines == 0) {lightMines++}
            else {lightMines--}
          }
          else {
            randLie = Math.floor(Math.random() * 2)
            if (randLie == 0 || darkMines == 0) {darkMines++}
            else {darkMines--}
          }
        }
        if (negationMode == true) {
          minesDisp = darkMines-lightMines
          if (minesDisp < 0) {minesDisp *= -1}
        }
        else {minesDisp = darkMines+lightMines}
        if (moduloMode == true) {minesDisp %= 3}
        mines[x].src = "img/Tile" + minesDisp + ".png"
      }
      else {
        //Automatically clicks nearby squares if the tile clicked is empty
        mines[x].src = "img/TileClicked.png"
        if (minicrossMode == false && gridNums[x - minesWidth - 1] != undefined && x % minesWidth != 0) clickMine(x - minesWidth - 1, testable=false)
        if (gridNums[x - minesWidth] != undefined) clickMine(x - minesWidth, testable=false)
        if (minicrossMode == false && gridNums[x - minesWidth + 1] != undefined && x % minesWidth != minesWidth - 1) clickMine(x - minesWidth + 1, testable=false)
        if (gridNums[x - 1] != undefined && x % minesWidth != 0) clickMine(x - 1, testable=false)
        if (gridNums[x + 1] != undefined && x % minesWidth != minesWidth - 1) clickMine(x + 1, testable=false)
        if (minicrossMode == false && gridNums[x + minesWidth - 1] != undefined && x % minesWidth != 0) clickMine(x + minesWidth - 1, testable=false)
        if (gridNums[x + minesWidth] != undefined) clickMine(x + minesWidth, testable=false)
        if (minicrossMode == false && gridNums[x + minesWidth + 1] != undefined && x % minesWidth != minesWidth - 1) clickMine(x + minesWidth + 1, testable=false)
      }
      
      checkIfDone()
      if (seconds == 0) {
        secondsUp()
      }
    }
  }
  //The weird mine check thing whatever the hell it's called
  //This is the uglist most unreadable mess I have ever coded
  else if (testable && alive && mines[x].dataset.clicked == "true" && mines[x].dataset.flagtype != "1" && mines[x].dataset.flagtype != "2") {
    minesNearby = 0
    if (minicrossMode == false && gridNums[x - minesWidth - 1] && x % minesWidth != 0) minesNearby += gridNums[x - minesWidth - 1]
    if (gridNums[x - minesWidth]) minesNearby += gridNums[x - minesWidth]
    if (minicrossMode == false && gridNums[x - minesWidth + 1] && x % minesWidth != minesWidth - 1) minesNearby += gridNums[x - minesWidth + 1]
    if (gridNums[x - 1] && x % minesWidth != 0) minesNearby += gridNums[x - 1]
    if (gridNums[x + 1] && x % minesWidth != minesWidth - 1) minesNearby += gridNums[x + 1]
    if (minicrossMode == false && gridNums[x + minesWidth - 1] && x % minesWidth != 0) minesNearby += gridNums[x + minesWidth - 1]
    if (gridNums[x + minesWidth]) minesNearby += gridNums[x + minesWidth]
    if (minicrossMode == false && gridNums[x + minesWidth + 1] && x % minesWidth != minesWidth - 1) minesNearby += gridNums[x + minesWidth + 1]
    flagsNearby = 0
    if (minicrossMode == false && gridNums[x - minesWidth - 1] != undefined && x % minesWidth != 0) {if (mines[x - minesWidth - 1].dataset.flagtype > 0) flagsNearby += mines[x - minesWidth - 1].dataset.flagtype-0}
    if (gridNums[x - minesWidth] != undefined) {if (mines[x - minesWidth].dataset.flagtype > 0) flagsNearby += mines[x - minesWidth].dataset.flagtype-0}
    if (minicrossMode == false && gridNums[x - minesWidth + 1] != undefined && x % minesWidth != minesWidth - 1) {if (mines[x - minesWidth + 1].dataset.flagtype > 0) flagsNearby += mines[x - minesWidth + 1].dataset.flagtype-0}
    if (gridNums[x - 1] != undefined && x % minesWidth != 0) {if (mines[x - 1].dataset.flagtype > 0) flagsNearby += mines[x - 1].dataset.flagtype-0}
    if (gridNums[x + 1] != undefined && x % minesWidth != minesWidth - 1) {if (mines[x + 1].dataset.flagtype > 0) flagsNearby += mines[x + 1].dataset.flagtype-0}
    if (minicrossMode == false && gridNums[x + minesWidth - 1] != undefined && x % minesWidth != 0) {if (mines[x + minesWidth - 1].dataset.flagtype > 0) flagsNearby += mines[x + minesWidth - 1].dataset.flagtype-0}
    if (gridNums[x + minesWidth] != undefined) {if (mines[x + minesWidth].dataset.flagtype > 0) flagsNearby += mines[x + minesWidth].dataset.flagtype-0}
    if (minicrossMode == false && gridNums[x + minesWidth + 1] != undefined && x % minesWidth != minesWidth - 1) {if (mines[x + minesWidth + 1].dataset.flagtype > 0) flagsNearby += mines[x + minesWidth + 1].dataset.flagtype-0}
    if (minesNearby > 0 && minesNearby == flagsNearby) {
      if (minicrossMode == false && gridNums[x - minesWidth - 1] != undefined && x % minesWidth != 0) clickMine(x - minesWidth - 1, testable=false)
      if (gridNums[x - minesWidth] != undefined) clickMine(x - minesWidth, testable=false)
      if (minicrossMode == false && gridNums[x - minesWidth + 1] != undefined && x % minesWidth != minesWidth - 1) clickMine(x - minesWidth + 1, testable=false)
      if (gridNums[x - 1] != undefined && x % minesWidth != 0) clickMine(x - 1, testable=false)
      if (gridNums[x + 1] != undefined && x % minesWidth != minesWidth - 1) clickMine(x + 1, testable=false)
      if (minicrossMode == false && gridNums[x + minesWidth - 1] != undefined && x % minesWidth != 0) clickMine(x + minesWidth - 1, testable=false)
      if (gridNums[x + minesWidth] != undefined) clickMine(x + minesWidth, testable=false)
      if (minicrossMode == false && gridNums[x + minesWidth + 1] != undefined && x % minesWidth != minesWidth - 1) clickMine(x + minesWidth + 1, testable=false)
    }
  }
}

function showChord(x) {
  mines[x].style.boxShadow = "0px 0px 5px 0px inset"
  if (!mines[x].src.includes("img/TileUnclicked.png") && !mines[x].src.includes("img/TileFlag1.png") && !mines[x].src.includes("img/TileFlag2.png") && !mines[x].src.includes("img/TileFlag3.png") && !mines[x].src.includes("img/TileQuestionMark.png")) {
    if (minicrossMode == false && gridNums[x - minesWidth - 1] != undefined && (mines[x - minesWidth - 1].src.includes("img/TileUnclicked.png") || mines[x - minesWidth - 1].src.includes("img/TileFlag1.png") || mines[x - minesWidth - 1].src.includes("img/TileFlag2.png") || mines[x - minesWidth - 1].src.includes("img/TileFlag3.png") || mines[x - minesWidth - 1].src.includes("img/TileQuestionMark.png")) && x % minesWidth != 0) mines[x - minesWidth - 1].style.boxShadow = "0px 0px 5px 0px inset"
    if (gridNums[x - minesWidth] != undefined && (mines[x - minesWidth].src.includes("img/TileUnclicked.png") || mines[x - minesWidth].src.includes("img/TileFlag1.png") || mines[x - minesWidth].src.includes("img/TileFlag2.png") || mines[x - minesWidth].src.includes("img/TileFlag3.png") || mines[x - minesWidth].src.includes("img/TileQuestionMark.png"))) mines[x - minesWidth].style.boxShadow = "0px 0px 5px 0px inset"
    if (minicrossMode == false && gridNums[x - minesWidth + 1] != undefined && (mines[x - minesWidth + 1].src.includes("img/TileUnclicked.png") || mines[x - minesWidth + 1].src.includes("img/TileFlag1.png") || mines[x - minesWidth + 1].src.includes("img/TileFlag2.png") || mines[x - minesWidth + 1].src.includes("img/TileFlag3.png") || mines[x - minesWidth + 1].src.includes("img/TileQuestionMark.png")) && x % minesWidth != minesWidth - 1) mines[x - minesWidth + 1].style.boxShadow = "0px 0px 5px 0px inset"
    if (gridNums[x - 1] != undefined && (mines[x - 1].src.includes("img/TileUnclicked.png") || mines[x - 1].src.includes("img/TileFlag1.png") || mines[x - 1].src.includes("img/TileFlag2.png") || mines[x - 1].src.includes("img/TileFlag3.png") || mines[x - 1].src.includes("img/TileQuestionMark.png")) && x % minesWidth != 0) mines[x - 1].style.boxShadow = "0px 0px 5px 0px inset"
    if (gridNums[x + 1] != undefined && (mines[x + 1].src.includes("img/TileUnclicked.png") || mines[x + 1].src.includes("img/TileFlag1.png") || mines[x + 1].src.includes("img/TileFlag2.png") || mines[x + 1].src.includes("img/TileFlag3.png") || mines[x + 1].src.includes("img/TileQuestionMark.png")) && x % minesWidth != minesWidth - 1) mines[x + 1].style.boxShadow = "0px 0px 5px 0px inset"
    if (minicrossMode == false && gridNums[x + minesWidth - 1] != undefined && (mines[x + minesWidth - 1].src.includes("img/TileUnclicked.png") || mines[x + minesWidth - 1].src.includes("img/TileFlag1.png") || mines[x + minesWidth - 1].src.includes("img/TileFlag2.png") || mines[x + minesWidth - 1].src.includes("img/TileFlag3.png") || mines[x + minesWidth - 1].src.includes("img/TileQuestionMark.png")) && x % minesWidth != 0) mines[x + minesWidth - 1].style.boxShadow = "0px 0px 5px 0px inset"
    if (gridNums[x + minesWidth] != undefined && (mines[x + minesWidth].src.includes("img/TileUnclicked.png") || mines[x + minesWidth].src.includes("img/TileFlag1.png") || mines[x + minesWidth].src.includes("img/TileFlag2.png") || mines[x + minesWidth].src.includes("img/TileFlag3.png") || mines[x + minesWidth].src.includes("img/TileQuestionMark.png"))) mines[x + minesWidth].style.boxShadow = "0px 0px 5px 0px inset"
    if (minicrossMode == false && gridNums[x + minesWidth + 1] != undefined && (mines[x + minesWidth + 1].src.includes("img/TileUnclicked.png") || mines[x + minesWidth + 1].src.includes("img/TileFlag1.png") || mines[x + minesWidth + 1].src.includes("img/TileFlag2.png") || mines[x + minesWidth + 1].src.includes("img/TileFlag3.png") || mines[x + minesWidth + 1].src.includes("img/TileQuestionMark.png")) && x % minesWidth != minesWidth - 1) mines[x + minesWidth + 1].style.boxShadow = "0px 0px 5px 0px inset"
  }
}
function hideChord(x) {
  mines[x].style.boxShadow = ""
  if (minicrossMode == false && gridNums[x - minesWidth - 1] != undefined && x % minesWidth != 0) mines[x - minesWidth - 1].style.boxShadow = ""
  if (gridNums[x - minesWidth] != undefined) mines[x - minesWidth].style.boxShadow = ""
  if (minicrossMode == false && gridNums[x - minesWidth + 1] != undefined && x % minesWidth != minesWidth - 1) mines[x - minesWidth + 1].style.boxShadow = ""
  if (gridNums[x - 1] != undefined && x % minesWidth != 0) mines[x - 1].style.boxShadow = ""
  if (gridNums[x + 1] != undefined && x % minesWidth != minesWidth - 1) mines[x + 1].style.boxShadow = ""
  if (minicrossMode == false && gridNums[x + minesWidth - 1] != undefined && x % minesWidth != 0) mines[x + minesWidth - 1].style.boxShadow = ""
  if (gridNums[x + minesWidth] != undefined) mines[x + minesWidth].style.boxShadow = ""
  if (minicrossMode == false && gridNums[x + minesWidth + 1] != undefined && x % minesWidth != minesWidth - 1) mines[x + minesWidth + 1].style.boxShadow = ""
}

function flagMine(x) {
  if (firstMove == false && mines[x].dataset.clicked == "false") {
    if (mines[x].dataset.flagtype == "-0") {
      mines[x].src = "img/TileUnclicked.png"
      mines[x].setAttribute("data-flagtype", 0)
    }
    else if (mines[x].dataset.flagtype == potency) {
      mines[x].src = "img/TileQuestionMark.png"
      mines[x].setAttribute("data-flagtype", "-0")
      flags -= potency
    }
    else {
      mines[x].setAttribute("data-flagtype", mines[x].dataset.flagtype-0 + 1)
      mines[x].src = "img/TileFlag" + mines[x].dataset.flagtype + ".png"
      flags++
    }
    flagsInRange = Math.max(Math.min(flags, noOfMines + noOfDoubleMines * 2 + noOfTripleMines * 3), 0)
    document.getElementsByClassName("number")[0].src = "img/Number" + Math.floor((noOfMines + noOfDoubleMines * 2 + noOfTripleMines * 3 - flagsInRange) / 100) + ".png"
    document.getElementsByClassName("number")[1].src = "img/Number" + Math.floor(((noOfMines + noOfDoubleMines * 2 + noOfTripleMines * 3 - flagsInRange) / 10) % 10) + ".png"
    document.getElementsByClassName("number")[2].src = "img/Number" + ((noOfMines + noOfDoubleMines * 2 + noOfTripleMines * 3 - flagsInRange) % 10) + ".png"
  }
}

function die(x) {
  alive = false
  document.getElementById("face").src = "img/faceDead.png"
  //Makes all tiles with a mine appear
  for (i=0;i<(minesWidth * minesHeight);i++) {
    if (gridNums[i] == 1) {
      if (mines[i].dataset.flagtype == 0 || mines[i].dataset.flagtype == "-0") mines[i].src = "img/TileMine1.png"
    }
    else if (gridNums[i] == 2) {
      if (mines[i].dataset.flagtype == 0 || mines[i].dataset.flagtype == "-0") mines[i].src = "img/TileMine2.png"
    }
    else if (gridNums[i] == 3) {
      if (mines[i].dataset.flagtype == 0 || mines[i].dataset.flagtype == "-0") mines[i].src = "img/TileMine3.png"
    }
    else if (mines[i].dataset.flagtype > 0) {mines[i].src = "img/TileMineCross.png"}
  }
  if (gridNums[x] == 1) mines[x].src = "img/TileMine1Hit.png"
  else if (gridNums[x] == 2) mines[x].src = "img/TileMine2Hit.png"
  else if (gridNums[x] == 3) mines[x].src = "img/TileMine3Hit.png"
}

function checkIfDone() {
  isDone = true
  for (i=0;i<(minesWidth * minesHeight);i++) {
    if (gridNums[i] == 0 && (mines[i].dataset.clicked == "false" || mines[i].dataset.flagtype == "-0")) {
      isDone = false
    }
  }
  if (isDone == true) {
    alive = false
    document.getElementById("face").src = "img/faceSunglasses.png"
    if (seconds < bestTime) {
      bestTime = seconds
    }
    document.getElementById("bestTime").innerHTML = bestTime.toLocaleString() + "s"
  }
}

function setScale() {
  document.getElementById("game").style.transform =  "translate(-50%, -50%) scale(" + document.getElementById("scale").value + "," + document.getElementById("scale").value + ")"
}

setInterval(setScale, 10)

function secondsUp() {
  seconds++
  if (alive == true) {
    if (seconds < 1000) {
      document.getElementsByClassName("number2")[0].style.display = "none"
      document.getElementsByClassName("number")[3].src = "img/Number" + Math.floor(seconds / 100) + ".png"
      document.getElementsByClassName("number")[4].src = "img/Number" + Math.floor((seconds % 100) / 10) + ".png"
      document.getElementsByClassName("number")[5].src = "img/Number" + (seconds % 10) + ".png"
    }
    else if (seconds < 10000) {
      document.getElementsByClassName("number2")[0].style.display = ""
      document.getElementsByClassName("number2")[0].src = "img/Number" + Math.floor(seconds / 1000) + ".png"
      document.getElementsByClassName("number")[3].src = "img/Number" + Math.floor(((seconds % 1000) - ((seconds % 100) / 10)) / 100) + ".png"
      document.getElementsByClassName("number")[4].src = "img/Number" + Math.floor((seconds % 100) / 10) + ".png"
      document.getElementsByClassName("number")[5].src = "img/Number" + (seconds % 10) + ".png"
    }
  }
  timer = setTimeout(secondsUp, 1000)
}

function resetBestTime() {
  bestTime = 99999
  document.getElementById("bestTime").innerHTML = "N/A"
}