const plrW = 32
const plrH = 32
const currentInputs = []
const plr1 = {
    hp: 100,
    speed: 5,
    jumps: 0,
    pos : {x : document.getElementById("plr1").getAttribute("data-startX")-0, y : document.getElementById("plr1").getAttribute("data-startY")-0},
    vel : {x : 0, y : 0},
    colIDs: [],
    colTags: []
}
function collision(plr) {
    plr.colIDs = []
    plr.colTags = []
    for (let j = 0; j < objects.length; j++) {
        let objX = objects[j].style.left.slice(0,-2)-0
        let objY = objects[j].style.bottom.slice(0,-2)-0
        let objW = objects[j].style.width.slice(0,-2)-0
        let objH = objects[j].style.height.slice(0,-2)-0
        let objTag = objects[j].classList[1]
        if (plr.pos.x + plrW >= objX && plr.pos.x <= objX + objW && plr.pos.y + plrH >= objY && plr.pos.y <= objY + objH) {
            plr.colIDs.push(j)
            plr.colTags.push(objTag)
            let vecX = plr.pos.x + (plrW / 2) - objX - objW / 2
            let vecY = plr.pos.y + (plrH / 2) - objY - objH / 2
            let hWidths = (plrW / 2) + objW / 2
            let hHeights = (plrH / 2) + objH / 2
            let colDir = null
            // if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
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
    }
}
function mainLoop() {
    objects = document.getElementsByClassName("col")
    collision(plr1)
    if (plr1.vel.y > -20) {plr1.vel.y--}
    document.getElementById("debug1").innerHTML = "speed : " + plr1.speed + "<br>jumps : " + plr1.jumps + "<br>pos : " + plr1.pos.x + "," + plr1.pos.y + "<br>vel : " + plr1.vel.x + "," + plr1.vel.y + "<br>colIDs : [" + plr1.colIDs.toString() + "]<br>colTags : [" + plr1.colTags.toString() + "]"
    plr1.vel.x = 0
    if (currentInputs.includes("ArrowUp") && plr1.jumps > 0 && plr1.vel.y <= 12) {plr1.vel.y = 20;plr1.jumps--}
    if (currentInputs.includes("ArrowLeft")) {plr1.vel.x -= plr1.speed}
    if (currentInputs.includes("ArrowDown") && plr1.vel.y > -40) {plr1.vel.y--}
    if (currentInputs.includes("ArrowRight")) {plr1.vel.x += + plr1.speed}
    plr1.pos.x += plr1.vel.x
    plr1.pos.y += plr1.vel.y
    document.getElementById("plr1").style.left = plr1.pos.x + "px"
    document.getElementById("plr1").style.bottom = plr1.pos.y + "px"
    var t = setTimeout(function(){mainLoop()},17)
}
document.addEventListener('keydown', (event) => {
    if (!currentInputs.includes(event.code)) {currentInputs.push(event.code)}
    document.getElementById("inputs").innerText = "[" + currentInputs.toString() + "]"
})
document.addEventListener('keyup', (event) => {
    if (currentInputs.includes(event.code)) {currentInputs.splice(currentInputs.indexOf(event.code),1)}
    document.getElementById("inputs").innerText = "[" + currentInputs.toString() + "]"
})
mainLoop()
