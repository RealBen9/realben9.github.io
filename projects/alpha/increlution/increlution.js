const fps = 50/3
const naturalIncrease = 14401/14400
const currentInputs = []
const queue = []
currHP = 100
healthDisp = 100
maxHP = 100
baseDecay = 0.5
decay = 0.5
decayDisp = "0.50"
const inventory = {}
const cooldowns = {}
capacity = 10
const genXP = [0,0,0,0,0,0]
const genLV = [0,0,0,0,0,0]
const insXP = [0,0,0,0,0,0]
const insLV = [0,0,0,0,0,0]
paused = false
scene = 0
const scenes = [
    ["Gather berries","Cut wood","Wooden cart","Wooden hut","Explore the area"],
    ["Gather berries","Cut wood","Catch fish","Cook fish","Wooden cart","Wooden hut","Campfire","Explore the cave"]
]
const actions = {
    //name: [type, skill, reward, time, cost/dmg?],
    "Gather berries": [0, 0, "Berry", 120],
    "Cut wood": [0, 1, "Wood", 300],
    "Catch fish": [0, 4, "Raw fish", 450],
    "Cook fish": [0, 4, "Cooked fish", 150, [["Campfire"],["Raw fish", 1]]],
    "Wooden cart": [1, 2, "Wooden cart", 1200, [["Wood", 10]]],
    "Wooden hut": [1, 2, "Wooden hut", 2400, [["Wood", 20]]],
    "Campfire": [1, 2, "Campfire", 600, [["Wood", 5]]],
    "Explore the area": [2, 3, "Scene", 1200],
    "Explore the cave": [2, 3, "Scene", 3000]
}
const items = {
    //name: [type, hp?],
    "Berry": [0, 5],
    "Wood": [1],
    "Raw fish": [1],
    "Cooked fish": [0, 20],
    "Wooden cart": [2],
    "Wooden hut": [2],
    "Campfire": [2],
    "Scene": [3]
}
const progress = {}
currActions = scenes[scene]
frames = 0
mm = 0
ss = 0
ms = 0
function updateSkill(skill) {
    const skillDisp = document.getElementById("sk" + skill)
    let skillType = ["Farming","Woodcutting","Construction","Agility","Fishing","Cooking"][skill]
    let levelDisp = (1.05**genLV[actions[queue[0][0]][1]]) * (1.01**insLV[actions[queue[0][0]][1]])
    if (levelDisp < 10) {levelDisp = Math.round(levelDisp*100)/100}
    else {levelDisp = Math.round(levelDisp*10)/10}
    if ((levelDisp < 10) && (levelDisp % 1 == 0)) {levelDisp += ".00"}
    else if ((levelDisp < 10) && (levelDisp*10 % 1 == 0)) {levelDisp += "0"}
    else if ((levelDisp < 100) && (levelDisp % 1 == 0)) {levelDisp += ".0"}
    if (skillDisp) {skillDisp.innerText = skillType + " x " + levelDisp}
}
function updateInventory() {
    const invDisp = document.getElementById("inventory")
    invDisp.innerHTML = "<tr><th>Item</th><th>Amount</th><th>Cooldown</th></tr>"
    invItems = Object.keys(inventory)
    capacity = 10
    for (let i = 0; i < invItems.length; i++) {
        if (items[invItems[i]][0] == 2) {
            if (invItems[i] == "Wooden cart") {capacity += 5}
        }
    }
    for (let i = 0; i < invItems.length; i++) {
        if (inventory[invItems[i]] == 0) {delete inventory[invItems[i]];delete invItems[i]}
        else if (items[invItems[i]][0] == 0) {
            invDisp.innerHTML += "<tr><td>" + invItems[i] + "</td><td>" + inventory[invItems[i]] + " / " + capacity + "</td><td id='" + invItems[i] + "'>" + (cooldowns[invItems[i]] || 0) + "f</td></tr>"
        } else if (items[invItems[i]][0] == 1) {
            invDisp.innerHTML += "<tr><td>" + invItems[i] + "</td><td>" + inventory[invItems[i]] + " / " + capacity + "</td><td></td></tr>"
        }
    }
}
function updateFood() {
    let invItems = Object.keys(inventory)
    sortedItems = []
    for (let i = 0; i < invItems.length; i++) {
        if (items[invItems[i]][0] == 0) {
            sortedItems.push([invItems[i],items[invItems[i]][1]])
        }
    }
    sortedItems = sortedItems.sort((a, b) => a[1]-b[1])
    for (let i = 0; i < sortedItems.length; i++) {
        if (cooldowns[sortedItems[i][0]] > 0) {
            cooldowns[sortedItems[i][0]]--
            document.getElementById(sortedItems[i][0]).innerHTML = cooldowns[sortedItems[i][0]] + "f"
        } else if (currHP <= maxHP - items[sortedItems[i][0]][1]) {
            inventory[sortedItems[i][0]]--
            currHP += items[sortedItems[i][0]][1]
            cooldowns[sortedItems[i][0]] = 300
            updateInventory()
            //document.getElementById(sortedItems[i][0]).innerHTML = "300f"
        }
    }
}
function updateQueue() {
    const queueDisp = document.getElementById("queue")
    queueDisp.innerHTML = "<tr><th>Order</th><th>Skill</th><th>Action</th></tr>"
    if (queue.length == 0) {queueDisp.innerHTML += "<tr><td>Now</td><td>None</td><td>Game paused</td></tr>"}
    else {
        for (let i = 0; i < queue.length; i++) {
            let order = ""
            if (i == 0) {order = "Now"}
            else if (i > 3 && i < 20) {order = (i + 1) + "th"}
            else if ((i + 1) % 10 == 1) {order = (i + 1) + "st"}
            else if ((i + 1) % 10 == 2) {order = (i + 1) + "nd"}
            else if ((i + 1) % 10 == 3) {order = (i + 1) + "rd"}
            else {order = (i + 1) + "th"}
            queueDisp.innerHTML += "<td>" + order + "</td><td>" + actions[queue[i][0]][1] + "</td><td>" + queue[i][0] + "</td>"
        }
    }
}
function addToQueue(action) {
    queue.push([action,actions[action][3]])
    updateQueue()
}
function updateActions() {
    const jobsDisp = document.getElementById("jobs")
    const constructionDisp = document.getElementById("construction")
    const explorationDisp = document.getElementById("exploration")
    jobsDisp.innerHTML = "<tr><th>Skill</th><th>Job</th><th>Action</th><th>Time</th></tr>"
    constructionDisp.innerHTML = "<tr><th>Skill</th><th>Building / tool</th><th>Action</th><th>Time</th></tr>"
    explorationDisp.innerHTML = "<tr><th>Skill</th><th>Goal</th><th>Action</th><th>Time</th></tr>"
    for (let i = 0; i < currActions.length; i++) {
        if (actions[currActions[i]][0] == 0) {
            jobsDisp.innerHTML += "<tr id='" + currActions[i] + "'><td>" + actions[currActions[i]][1] + "</td><td>" + currActions[i] + "</td><td><button onclick=\"addToQueue('" + currActions[i] + "')\">Add to queue</button></td><td>" + actions[currActions[i]][3] + "f / " + actions[currActions[i]][3] + "f </td></tr>"
        }
        else if (actions[currActions[i]][0] == 1 && inventory[actions[currActions[i]][2]] == undefined) {
            constructionDisp.innerHTML += "<tr id='" + currActions[i] + "'><td>" + actions[currActions[i]][1] + "</td><td>" + currActions[i] + "</td><td><button onclick=\"addToQueue('" + currActions[i] + "')\">Add to queue</button></td><td>" + actions[currActions[i]][3] + "f / " + actions[currActions[i]][3] + "f </td></tr>"
        }
        else if (actions[currActions[i]][0] == 2) {
            explorationDisp.innerHTML += "<tr id='" + currActions[i] + "'><td>" + actions[currActions[i]][1] + "</td><td>" + currActions[i] + "</td><td><button onclick=\"addToQueue('" + currActions[i] + "')\">Add to queue</button></td><td>" + actions[currActions[i]][3] + "f / " + actions[currActions[i]][3] + "f </td></tr>"
        }
    }
}
function mainLoop() {
    const hpDisp = document.getElementById("hp")
    const hdDisp = document.getElementById("hpDecay")
    const timeDisp = document.getElementById("time")
    if (hpDisp) {hpDisp.innerText = "HP : " + healthDisp + " / " + maxHP}
    if (hdDisp) {hdDisp.innerText = "HD/s : " + decayDisp}

    ms = frames*fps
    if (ms >= 1000) {
        ss = Math.floor(ms/1000)
        ms %= 1000
        if (ss >= 60) {
            mm = Math.floor(ss/60)
            ss %= 60
        }
    }
    mmdisp = (mm < 10) ? "0" + mm : mm
    ssdisp = (ss < 10) ? "0" + ss : ss
    msdisp0 = Math.round(ms) % 1000
    msdisp0 = (msdisp0 < 100) ? (msdisp0 < 10) ? "00" + msdisp0 : "0" + msdisp0 : msdisp0
    time = mmdisp + ":" + ssdisp + "." + msdisp0
    if (timeDisp) {timeDisp.innerText = "Time : " + time + " (" + frames + "f)"}
    const buttonQ = document.getElementById("btnQueue")
    if (paused == true) {
        buttonQ.style.backgroundColor = "#f00"
        buttonQ.innerText = "Paused (manual)"
    } else if (queue.length > 0) {
        buttonQ.style.backgroundColor = "#0f0"
        buttonQ.innerText = "Running"
    } else {
        buttonQ.style.backgroundColor = "#f00"
        buttonQ.innerText = "Paused (empty queue)"
    }

    if (currHP > 0) {
        if (paused == false && queue.length > 0) {
            const progressDisp = document.getElementById(queue[0][0])
            const timerDisp = progressDisp.getElementsByTagName("td")[3]
            progress[queue[0][0]] = (progress[queue[0][0]] || 0) + ((1.05**genLV[actions[queue[0][0]][1]]) * (1.01**insLV[actions[queue[0][0]][1]]))
            genXP[actions[queue[0][0]][1]] += 1/60
            if (genXP[actions[queue[0][0]][1]] >= 10) {
                genXP[actions[queue[0][0]][1]] -= 10
                genLV[actions[queue[0][0]][1]] += 1
                updateSkill(actions[queue[0][0]][1])
            }
            insXP[actions[queue[0][0]][1]] += 1/60
            if (insXP[actions[queue[0][0]][1]] >= 25) {
                insXP[actions[queue[0][0]][1]] -= 25
                insLV[actions[queue[0][0]][1]] += 1
                updateSkill(actions[queue[0][0]][1])
            }
            progressDisp.style.backgroundImage = "linear-gradient(to right, #0f0 " + (progress[queue[0][0]]/actions[queue[0][0]][3]*100) + "%, #0000 " + (progress[queue[0][0]]/actions[queue[0][0]][3]*100) + "%)"
            timerDisp.innerText = Math.round((actions[queue[0][0]][3] - progress[queue[0][0]])*100)/100 + "f / " + actions[queue[0][0]][3] + "f"
            if (progress[queue[0][0]] >= actions[queue[0][0]][3]) {
                progress[queue[0][0]] -= actions[queue[0][0]][3]
                progressDisp.style.backgroundImage = "linear-gradient(to right, #0f0 " + (progress[queue[0][0]]/actions[queue[0][0]][3]*100) + "%, #0000 " + (progress[queue[0][0]]/actions[queue[0][0]][3]*100) + "%)"
            timerDisp.innerText = Math.round((actions[queue[0][0]][3] - progress[queue[0][0]])*100)/100 + "f / " + actions[queue[0][0]][3] + "f"
                if (actions[queue[0][0]][0] == 0) {
                    inventory[actions[queue[0][0]][2]] = (inventory[actions[queue[0][0]][2]] || 0) + 1
                    updateInventory()
                } else if (actions[queue[0][0]][0] == 1) {
                    for (let i = 0; i < actions[queue[0][0]][4].length; i++) {
                        inventory[actions[queue[0][0]][4][i][0]] -= actions[queue[0][0]][4][i][1] || 0
                    }
                    inventory[actions[queue[0][0]][2]] = (inventory[actions[queue[0][0]][2]] || 0) + 1
                    updateInventory()
                    updateActions()
                } else if (actions[queue[0][0]][0] == 2) {
                    //scene++
                    //currActions = scenes[scene]
                    updateActions()
                }
                queue.shift()
                updateQueue()
            }
            updateFood()
            decay = baseDecay
            if (inventory["Wooden hut"] > 0) {decay /= 2}
            currHP -= decay/60
            if (currHP < 10) {healthDisp = Math.round(currHP*100)/100}
            else {healthDisp = Math.round(currHP*10)/10}
            if ((healthDisp < 10) && (healthDisp % 1 == 0)) {healthDisp += ".00"}
            else if ((healthDisp < 10) && (healthDisp*10 % 1 == 0)) {healthDisp += "0"}
            else if ((healthDisp < 100) && (healthDisp % 1 == 0)) {healthDisp += ".0"}
            baseDecay *= naturalIncrease
            decay *= naturalIncrease
            if (decay < 10) {decayDisp = Math.round(decay*100)/100}
            else {decayDisp = Math.round(decay*10)/10}
            if ((decayDisp < 10) && (decayDisp % 1 == 0)) {decayDisp += ".00"}
            else if ((decayDisp < 10) && (decayDisp*10 % 1 == 0)) {decayDisp += "0"}
            else if ((decayDisp < 100) && (decayDisp % 1 == 0)) {decayDisp += ".0"}
            frames++
        }
        var t = setTimeout(function(){mainLoop()},fps)
    } else if (currHP < 0) {
        currHP = 0
        var t = setTimeout(function(){mainLoop()},fps)
    }
}
document.addEventListener('keydown', (event) => {
    if (!currentInputs.includes(event.code)) {currentInputs.push(event.code)}
    if (event.code == "Space") {paused = !paused}
    document.getElementById("inputs").innerText = "[" + currentInputs.toString() + "]"
})
document.addEventListener('keyup', (event) => {
    if (currentInputs.includes(event.code)) {currentInputs.splice(currentInputs.indexOf(event.code),1)}
    document.getElementById("inputs").innerText = "[" + currentInputs.toString() + "]"
})
mainLoop()
