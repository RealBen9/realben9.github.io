const plrW = 16
const plrH = 24
const currentInputs = []
const plr1 = {
    speed : 2.72,
    jumps : 0,
    actions : [],
    whiteKeys : 0,
    orangeKeys : 0,
    purpleKeys : 0,
    pinkKeys : 0,
    cyanKeys : 0,
    greenKeys : 0,
    blueKeys : 0,
    redKeys : 0,
    masterKeys : 0,
    masterMode : false,
    pos : {x : document.getElementById("plr1").getAttribute("data-startX")-0, y : document.getElementById("plr1").getAttribute("data-startY")-0},
    vel : {x : 0, y : 0},
    colIDs : [],
    colTags : []
}
function collision(plr) {
    plr.colIDs = []
    plr.colTags = []
    for (let j = 0; j < objects.length; j++) {
        let objX = objects[j].style.left.slice(0,-2)-0
        let objY = objects[j].style.bottom.slice(0,-2)-0
        let objW = objects[j].style.width.slice(0,-2)-0
        let objH = objects[j].style.height.slice(0,-2)-0
        let objName = objects[j].classList[1]
        if (plr.pos.x + plrW >= objX && plr.pos.x <= objX + objW && plr.pos.y + plrH >= objY && plr.pos.y <= objY + objH) {
            plr.colIDs.push(j)
            plr.colTags.push(objName)
            let objCount = objects[j].getAttribute("data-count")-0
            if (objName.slice(-3) == "Key") {
                plr.actions.push({name : objName, x : objX, y : objY, w : objW, h : objH, id : j}, {x : plr.pos.x-plr.vel.x, y : plr.pos.y-plr.vel.y}, {[objName.slice(0,-3) + "Keys"] : plr[objName.slice(0,-3) + "Keys"]})
                plr[objName.slice(0,-3) + "Keys"] += objCount
                objects[j].style.width = "0px"
                objects[j].style.height = "0px"
                objects[j].style.left = "0px"
                objects[j].style.bottom = "0px"
                objects[j].style.display = "none"
                break
            }
            else if (objName.slice(-4) == "Door") {
                if (plr.masterMode == true) {
                    plr.actions.push({name : objName, x : objX, y : objY, w : objW, h : objH, id : j}, {x : plr.pos.x-plr.vel.x, y : plr.pos.y-plr.vel.y}, {masterKeys : plr.masterKeys})
                    plr.masterKeys -= 1
                    objects[j].style.width = "0px"
                    objects[j].style.height = "0px"
                    objects[j].style.left = "0px"
                    objects[j].style.bottom = "0px"
                    plr.masterMode = false
                }
                else if ((objCount > 0 && plr[objName.slice(0,-4) + "Keys"] >= objCount) || (objCount == 0  && plr[objName.slice(0,-4) + "Keys"] == 0)) {
                    plr.actions.push({name : objName, x : objX, y : objY, w : objW, h : objH, id : j}, {x : plr.pos.x-plr.vel.x, y : plr.pos.y-plr.vel.y}, {[objName.slice(0,-4) + "Keys"] : plr[objName.slice(0,-4) + "Keys"]})
                    plr[objName.slice(0,-4) + "Keys"] -= objCount
                    objects[j].style.width = "0px"
                    objects[j].style.height = "0px"
                    objects[j].style.left = "0px"
                    objects[j].style.bottom = "0px"
                }
            }
            if (objName != "goal") {
                let vecX = plr.pos.x + (plrW / 2) - objX - objW / 2
                let vecY = plr.pos.y + (plrH / 2) - objY - objH / 2
                let hWidths = (plrW / 2) + objW / 2
                let hHeights = (plrH / 2) + objH / 2
                let colDir = null
                // if the x and y vector are less than the half width or half height, then we must be inside the object, causing a collision
                if (Math.abs(vecX) < hWidths && Math.abs(vecY) < hHeights) {
                    // figures out on which side we are colliding (top, bottom, left, or right)
                    oX = hWidths - Math.abs(vecX)
                    oY = hHeights - Math.abs(vecY)
                    if (oX >= oY) {
                        plr.vel.y = 0
                        if (vecY > 0) {
                            colDir = "b"
                            plr.pos.y += oY
                            plr.jumps = 2
                        } else {
                            colDir = "t"
                            plr.pos.y -= oY
                        }
                    } else {
                        if (vecX > 0) {
                            colDir = "l"
                            plr.pos.x += oX
                        } else {
                            colDir = "r"
                            plr.pos.x -= oX
                        }
                    }
                }
            }
            else {
                document.getElementById("next").style.display = ""
            }
        }
    }
}
function undo(plr) {
    if (plr.actions.length - 3 >= 0) {
        let obj = plr.actions[plr.actions.length-3]
        let plr0 = plr.actions[plr.actions.length-2]
        plr.pos = plr0
        plr.masterMode = false
        let changedKeys = plr.actions[plr.actions.length-1]
        if (changedKeys.whiteKeys != undefined) {plr.whiteKeys = changedKeys.whiteKeys}
        if (changedKeys.orangeKeys != undefined) {plr.orangeKeys = changedKeys.orangeKeys}
        if (changedKeys.purpleKeys != undefined) {plr.purpleKeys = changedKeys.purpleKeys}
        if (changedKeys.pinkKeys != undefined) {plr.pinkKeys = changedKeys.pinkKeys}
        if (changedKeys.cyanKeys != undefined) {plr.cyanKeys = changedKeys.cyanKeys}
        if (changedKeys.greenKeys != undefined) {plr.greenKeys = changedKeys.greenKeys}
        if (changedKeys.blueKeys != undefined) {plr.blueKeys = changedKeys.blueKeys}
        if (changedKeys.redKeys != undefined) {plr.redKeys = changedKeys.redKeys}
        if (changedKeys.masterKeys != undefined) {plr.masterKeys = changedKeys.masterKeys}
        if (obj.name.slice(-3) == "Key") {
            objects[obj.id].style.display = ""
        }
        objects[obj.id].style.width = obj.w + "px"
        objects[obj.id].style.height = obj.h + "px"
        objects[obj.id].style.left = obj.x + "px"
        objects[obj.id].style.bottom = obj.y + "px"
        plr.actions = plr.actions.slice(0,-3)
    }
}
function mainLoop() {
    objects = document.getElementsByClassName("col")
    collision(plr1)
    if (plr1.vel.y > -15) {plr1.vel.y--}
    const whiteDisp = document.getElementById("whiteKeys")
    const orangeDisp = document.getElementById("orangeKeys")
    const purpleDisp = document.getElementById("purpleKeys")
    const pinkDisp = document.getElementById("pinkKeys")
    const cyanDisp = document.getElementById("cyanKeys")
    const greenDisp = document.getElementById("greenKeys")
    const blueDisp = document.getElementById("blueKeys")
    const redDisp = document.getElementById("redKeys")
    const masterDisp = document.getElementById("masterKeys")
	if (whiteDisp) {whiteDisp.innerText = "x " + plr1.whiteKeys}
	if (orangeDisp) {orangeDisp.innerText = "x " + plr1.orangeKeys}
	if (purpleDisp) {purpleDisp.innerText = "x " + plr1.purpleKeys}
	if (pinkDisp) {pinkDisp.innerText = "x " + plr1.pinkKeys}
	if (cyanDisp) {cyanDisp.innerText = "x " + plr1.cyanKeys}
	if (greenDisp) {greenDisp.innerText = "x " + plr1.greenKeys}
	if (blueDisp) {blueDisp.innerText = "x " + plr1.blueKeys}
	if (redDisp) {redDisp.innerText = "x " + plr1.redKeys}
	if (masterDisp) {
        masterDisp.innerText = "x " + plr1.masterKeys
        if (plr1.masterMode == true) {masterDisp.classList.add("masterMode")}
        else {masterDisp.classList.remove("masterMode")}
    }
    plr1.vel.x = 0
    if (currentInputs.includes("ArrowUp") && plr1.jumps > 0 && plr1.vel.y <= 9) {plr1.vel.y = 15;plr1.jumps--}
    if (currentInputs.includes("ArrowLeft")) {plr1.vel.x -= plr1.speed}
    if (currentInputs.includes("ArrowDown") && plr1.vel.y > -30) {plr1.vel.y--}
    if (currentInputs.includes("ArrowRight")) {plr1.vel.x += plr1.speed}
    plr1.pos.x += plr1.vel.x
    plr1.pos.y += plr1.vel.y
    document.getElementById("plr1").style.left = plr1.pos.x + "px"
    document.getElementById("plr1").style.bottom = plr1.pos.y + "px"
    var t = setTimeout(function(){mainLoop()},17)
}
document.addEventListener('keydown', (event) => {
    if (!currentInputs.includes(event.code)) {currentInputs.push(event.code)}
    if (event.code == "KeyZ") {undo(plr1)}
    else if (event.code == "KeyX") {if (plr1.masterKeys != 0) {plr1.masterMode = !plr1.masterMode}}
    document.getElementById("inputs").innerText = "[" + currentInputs.toString() + "]"
})
document.addEventListener('keyup', (event) => {
    if (currentInputs.includes(event.code)) {currentInputs.splice(currentInputs.indexOf(event.code),1)}
    document.getElementById("inputs").innerText = "[" + currentInputs.toString() + "]"
})
mainLoop()
