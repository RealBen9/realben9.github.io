minesWidth = 16
minesHeight = 13
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
  if (noOfTripleMines > 0) {
    potency = 3
    document.getElementById("size").innerHTML = "16x13/" + noOfMines + "+(" + noOfDoubleMines + "*2)" + "+(" + noOfTripleMines + "*3)"
    document.getElementById("minefield").style.backgroundImage = "linear-gradient(315deg, #e2e, #2ee)"
    document.getElementById("minefield").style.display = ""
  }
  else if (noOfDoubleMines > 0) {
    potency = 2
    document.getElementById("size").innerHTML = "16x13/" + noOfMines + "+(" + noOfDoubleMines + "*2)"
    document.getElementById("minefield").style.backgroundImage = "linear-gradient(135deg, #e2e, #2ee)"
    document.getElementById("minefield").style.display = ""
  }
  else if (noOfMines > 0) {
    potency = 1
    document.getElementById("size").innerHTML = "16x13/" + noOfMines
    document.getElementById("minefield").style.backgroundImage = "linear-gradient(#666, #666)"
    document.getElementById("minefield").style.display = ""
  }
  else {
    potency = 0
    document.getElementById("minefield").style.display = "none"
  }
  for (i=0;i<noOfMines;i) {
    randomLocation = Math.floor(Math.random() * (minesWidth * minesHeight))
    if (gridNums[randomLocation] == 0) {
      gridNums[randomLocation] = 1
      i++
    }
  }
  for (i=0;i<noOfDoubleMines;i) {
    randomLocation = Math.floor(Math.random() * (minesWidth * minesHeight))
    if (gridNums[randomLocation] == 0) {
      gridNums[randomLocation] = 2
      i++
    }
  }
  for (i=0;i<noOfTripleMines;i) {
    randomLocation = Math.floor(Math.random() * (minesWidth * minesHeight))
    if (gridNums[randomLocation] == 0) {
      gridNums[randomLocation] = 3
      i++
    }
  }
}

createMines()

function createGame() {
  noOfMines = Math.min(parseInt(document.getElementById("noOfMines").value), 207)
  noOfDoubleMines = Math.min(parseInt(document.getElementById("noOfDoubleMines").value), 207)
  noOfTripleMines = Math.min(parseInt(document.getElementById("noOfTripleMines").value), 207)
  document.getElementById("mineDensity").innerHTML = Math.round((noOfMines + noOfDoubleMines + noOfTripleMines) / 0.0208) / 100 + "%"
  
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
      if (alive == true) {clickMine(parseInt(this.id))}
    })
    mines[i].addEventListener('auxclick', function(e){
      if (e.button == 1 && alive == true) {clickMine(parseInt(this.id))}
    })
    mines[i].addEventListener('contextmenu', function(){
      if (alive == true) {flagMine(parseInt(this.id))}
    })
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
      if (gridNums[x - minesWidth - 1] && x % minesWidth != 0) minesNearby += gridNums[x - minesWidth - 1]
      if (gridNums[x - minesWidth]) minesNearby += gridNums[x - minesWidth]
      if (gridNums[x - minesWidth + 1] && x % minesWidth != minesWidth - 1) minesNearby += gridNums[x - minesWidth + 1]
      if (gridNums[x - 1] && x % minesWidth != 0) minesNearby += gridNums[x - 1]
      if (gridNums[x + 1] && x % minesWidth != minesWidth - 1) minesNearby += gridNums[x + 1]
      if (gridNums[x + minesWidth - 1] && x % minesWidth != 0) minesNearby += gridNums[x + minesWidth - 1]
      if (gridNums[x + minesWidth]) minesNearby += gridNums[x + minesWidth]
      if (gridNums[x + minesWidth + 1] && x % minesWidth != minesWidth - 1) minesNearby += gridNums[x + minesWidth + 1]
      
      if (minesNearby > 0) {mines[x].src = "img/Tile" + minesNearby + ".png"}
      else {
        //Automatically clicks nearby squares if the tile clicked is empty
        mines[x].src = "img/TileClicked.png"
        if (gridNums[x - minesWidth - 1] != undefined && x % minesWidth != 0) clickMine(x - minesWidth - 1, testable=false)
        if (gridNums[x - minesWidth] != undefined) clickMine(x - minesWidth, testable=false)
        if (gridNums[x - minesWidth + 1] != undefined && x % minesWidth != minesWidth - 1) clickMine(x - minesWidth + 1, testable=false)
        if (gridNums[x - 1] != undefined && x % minesWidth != 0) clickMine(x - 1, testable=false)
        if (gridNums[x + 1] != undefined && x % minesWidth != minesWidth - 1) clickMine(x + 1, testable=false)
        if (gridNums[x + minesWidth - 1] != undefined && x % minesWidth != 0) clickMine(x + minesWidth - 1, testable=false)
        if (gridNums[x + minesWidth] != undefined) clickMine(x + minesWidth, testable=false)
        if (gridNums[x + minesWidth + 1] != undefined && x % minesWidth != minesWidth - 1) clickMine(x + minesWidth + 1, testable=false)
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
    if (gridNums[x - minesWidth - 1] && x % minesWidth != 0) minesNearby += gridNums[x - minesWidth - 1]
    if (gridNums[x - minesWidth]) minesNearby += gridNums[x - minesWidth]
    if (gridNums[x - minesWidth + 1] && x % minesWidth != minesWidth - 1) minesNearby += gridNums[x - minesWidth + 1]
    if (gridNums[x - 1] && x % minesWidth != 0) minesNearby += gridNums[x - 1]
    if (gridNums[x + 1] && x % minesWidth != minesWidth - 1) minesNearby += gridNums[x + 1]
    if (gridNums[x + minesWidth - 1] && x % minesWidth != 0) minesNearby += gridNums[x + minesWidth - 1]
    if (gridNums[x + minesWidth]) minesNearby += gridNums[x + minesWidth]
    if (gridNums[x + minesWidth + 1] && x % minesWidth != minesWidth - 1) minesNearby += gridNums[x + minesWidth + 1]
    flagsNearby = 0
    if (gridNums[x - minesWidth - 1] != undefined && x % minesWidth != 0) {if (mines[x - minesWidth - 1].dataset.flagtype > 0) flagsNearby += mines[x - minesWidth - 1].dataset.flagtype-0}
    if (gridNums[x - minesWidth] != undefined) {if (mines[x - minesWidth].dataset.flagtype > 0) flagsNearby += mines[x - minesWidth].dataset.flagtype-0}
    if (gridNums[x - minesWidth + 1] != undefined && x % minesWidth != minesWidth - 1) {if (mines[x - minesWidth + 1].dataset.flagtype > 0) flagsNearby += mines[x - minesWidth + 1].dataset.flagtype-0}
    if (gridNums[x - 1] != undefined && x % minesWidth != 0) {if (mines[x - 1].dataset.flagtype > 0) flagsNearby += mines[x - 1].dataset.flagtype-0}
    if (gridNums[x + 1] != undefined && x % minesWidth != minesWidth - 1) {if (mines[x + 1].dataset.flagtype > 0) flagsNearby += mines[x + 1].dataset.flagtype-0}
    if (gridNums[x + minesWidth - 1] != undefined && x % minesWidth != 0) {if (mines[x + minesWidth - 1].dataset.flagtype > 0) flagsNearby += mines[x + minesWidth - 1].dataset.flagtype-0}
    if (gridNums[x + minesWidth] != undefined) {if (mines[x + minesWidth].dataset.flagtype > 0) flagsNearby += mines[x + minesWidth].dataset.flagtype-0}
    if (gridNums[x + minesWidth + 1] != undefined && x % minesWidth != minesWidth - 1) {if (mines[x + minesWidth + 1].dataset.flagtype > 0) flagsNearby += mines[x + minesWidth + 1].dataset.flagtype-0}
    if (minesNearby > 0 && minesNearby == flagsNearby) {
      if (gridNums[x - minesWidth - 1] != undefined && x % minesWidth != 0) clickMine(x - minesWidth - 1, testable=false)
      if (gridNums[x - minesWidth] != undefined) clickMine(x - minesWidth, testable=false)
      if (gridNums[x - minesWidth + 1] != undefined && x % minesWidth != minesWidth - 1) clickMine(x - minesWidth + 1, testable=false)
      if (gridNums[x - 1] != undefined && x % minesWidth != 0) clickMine(x - 1, testable=false)
      if (gridNums[x + 1] != undefined && x % minesWidth != minesWidth - 1) clickMine(x + 1, testable=false)
      if (gridNums[x + minesWidth - 1] != undefined && x % minesWidth != 0) clickMine(x + minesWidth - 1, testable=false)
      if (gridNums[x + minesWidth] != undefined) clickMine(x + minesWidth, testable=false)
      if (gridNums[x + minesWidth + 1] != undefined && x % minesWidth != minesWidth - 1) clickMine(x + minesWidth + 1, testable=false)
    }
  }
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
  if (seconds < 999 && alive == true) {
    seconds++
    document.getElementsByClassName("number")[3].src = "img/Number" + Math.floor(seconds / 100) + ".png"
    document.getElementsByClassName("number")[4].src = "img/Number" + Math.floor((seconds % 100) / 10) + ".png"
    document.getElementsByClassName("number")[5].src = "img/Number" + (seconds % 10) + ".png"
    timer = setTimeout(secondsUp, 1000)
  }
}

function resetBestTime() {
  bestTime = 99999
  document.getElementById("bestTime").innerHTML = "N/A"
}