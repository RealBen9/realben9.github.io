window.addEventListener('load', function () {
    modulesolved = false
    strikes = 0
    striketimer = 0
    mm = 0
    ss = 0
    ms = 0
	info0 = document.getElementById("info0")
    strikesdisp = document.getElementById("strikes")
	if (info0) {
        serial0 = Math.floor(Math.random() * 2)
        if (serial0 == 0) {serial0 = Math.floor(Math.random() * 10)}
        else {serial0 = (Math.floor(Math.random() * 26) + 10).toString(36)}
        serial1 = Math.floor(Math.random() * 2)
        if (serial1 == 0) {serial1 = Math.floor(Math.random() * 10)}
        else {serial1 = (Math.floor(Math.random() * 26) + 10).toString(36)}
        serial2 = Math.floor(Math.random() * 10)
        serial3 = (Math.floor(Math.random() * 26) + 10).toString(36)
        serial4 = (Math.floor(Math.random() * 26) + 10).toString(36)
        serial5 = Math.floor(Math.random() * 10)
        serial = (serial0 + "" + serial1 + serial2 + serial3 + serial4 + serial5).toUpperCase()
        info0.innerHTML = info0.innerHTML + '<div class="widget serial">' + serial + '</div>'
        batteries = Math.floor(Math.random() * 4)
        if (batteries == 0) {}
        else if (batteries == 1) {info0.innerHTML = info0.innerHTML + '<div class="widget separator"></div><div class="widget battery d"></div>'}
        else if (batteries == 2) {
            indcount = Math.floor(Math.random() * 2)
            if (indcount == 0) info0.innerHTML = info0.innerHTML + '<div class="widget separator"></div><div class="widget battery aa"></div>'
            else info0.innerHTML = info0.innerHTML + '<div class="widget separator"></div><div class="widget battery d"></div><div class="widget battery d"></div>'
        }
        else {
            indcount = Math.floor(Math.random() * 3)
            if (indcount == 0) info0.innerHTML = info0.innerHTML + '<div class="widget separator"></div><div class="widget battery aa"></div><div class="widget battery d"></div>'
            else if (indcount == 1) info0.innerHTML = info0.innerHTML + '<div class="widget separator"></div><div class="widget battery d"></div><div class="widget battery aa"></div>'
            else info0.innerHTML = info0.innerHTML + '<div class="widget separator"></div><div class="widget battery d"></div><div class="widget battery d"></div><div class="widget battery d"></div>'
        }
        indcount = Math.floor(Math.random() * 3)
        if (indcount == 0) {
            ind0 = -1
            lit0 = -1
            ind1 = -1
            lit1 = -1
        }
        else if (indcount == 1) {
            ind0 = Math.floor(Math.random() * 11)
            ind1 = -1
            if (ind0 == 0) {ind0 = "BOB"}
            else if (ind0 == 1) {ind0 = "CAR"}
            else if (ind0 == 2) {ind0 = "CLR"}
            else if (ind0 == 3) {ind0 = "FRK"}
            else if (ind0 == 4) {ind0 = "FRQ"}
            else if (ind0 == 5) {ind0 = "IND"}
            else if (ind0 == 6) {ind0 = "MSA"}
            else if (ind0 == 7) {ind0 = "NSA"}
            else if (ind0 == 8) {ind0 = "SIG"}
            else if (ind0 == 9) {ind0 = "SND"}
            else if (ind0 == 10) {ind0 = "TRN"}
            lit0 = Math.floor(Math.random() * 2)
            if (lit0 == 0) {info0.innerHTML = info0.innerHTML + '<div class="widget separator"></div><div class="widget indicator unlit"><span class="label">' + ind0 + '</span></div>'}
            else {info0.innerHTML = info0.innerHTML + '<div class="widget separator"></div><div class="widget indicator lit"><span class="label">' + ind0 + '</span></div>'}
            lit1 = -1
        }
        else {
            ind0 = Math.floor(Math.random() * 11)
            ind1 = Math.floor(Math.random() * 11)
            while (ind0 == ind1) ind1 = Math.floor(Math.random() * 11)
            if (ind0 == 0) {ind0 = "BOB"}
            else if (ind0 == 1) {ind0 = "CAR"}
            else if (ind0 == 2) {ind0 = "CLR"}
            else if (ind0 == 3) {ind0 = "FRK"}
            else if (ind0 == 4) {ind0 = "FRQ"}
            else if (ind0 == 5) {ind0 = "IND"}
            else if (ind0 == 6) {ind0 = "MSA"}
            else if (ind0 == 7) {ind0 = "NSA"}
            else if (ind0 == 8) {ind0 = "SIG"}
            else if (ind0 == 9) {ind0 = "SND"}
            else if (ind0 == 10) {ind0 = "TRN"}
            lit0 = Math.floor(Math.random() * 2)
            if (lit0 == 0) {info0.innerHTML = info0.innerHTML + '<div class="widget separator"></div><div class="widget indicator unlit"><span class="label">' + ind0 + '</span></div>'}
            else {info0.innerHTML = info0.innerHTML + '<div class="widget separator"></div><div class="widget indicator lit"><span class="label">' + ind0 + '</span></div>'}
            if (ind1 == 0) {ind1 = "BOB"}
            else if (ind1 == 1) {ind1 = "CAR"}
            else if (ind1 == 2) {ind1 = "CLR"}
            else if (ind1 == 3) {ind1 = "FRK"}
            else if (ind1 == 4) {ind1 = "FRQ"}
            else if (ind1 == 5) {ind1 = "IND"}
            else if (ind1 == 6) {ind1 = "MSA"}
            else if (ind1 == 7) {ind1 = "NSA"}
            else if (ind1 == 8) {ind1 = "SIG"}
            else if (ind1 == 9) {ind1 = "SND"}
            else if (ind1 == 10) {ind1 = "TRN"}
            lit1 = Math.floor(Math.random() * 2)
            if (lit1 == 0) {info0.innerHTML = info0.innerHTML + '<div class="widget indicator unlit"><span class="label">' + ind1 + '</span></div>'}
            else {info0.innerHTML = info0.innerHTML + '<div class="widget indicator lit"><span class="label">' + ind1 + '</span></div>'}
        }
	}
    currentBombTime()
})
function strike() {
    console.log("[" + time + "] Strike!")
    strikes++
    striketimer = 500
    if (strikes == 1) strikesdisp.innerHTML = "X_"
    else if (strikes == 2) strikesdisp.innerHTML = "XX"
    else if (strikes < 100) strikesdisp.innerHTML = strikes + "X"
    else strikesdisp.innerHTML = strikes
}
function solve() {
    console.log("[" + time + "] Solve!")
    document.getElementById("bombClock").style.color = "#0f0"
    modulesolved = true
}
function currentBombTime() {
    if (modulesolved == false) {
        ms = ms + (17 * Math.min(2,(1 + (strikes / 4))))
        if (striketimer > 0) {
            striketimer = striketimer - 17
            document.getElementById("bombClock").style.color = "#f00"
        }
        else document.getElementById("bombClock").style.color = "#0ff"
        if (ms >= 1000) {
            ss++
            ms = ms - 1000
            if (ss >= 60) {
                mm++
                ss = ss - 60
            }
        }
        mmdisp = (mm < 10) ? "0" + mm : mm
        ssdisp = (ss < 10) ? "0" + ss : ss
        msdisp0 = (ms < 100) ? (ms < 10) ? "00" + ms : "0" + ms : ms
        msdisp = ("" + msdisp0).slice(0,2)
        if (mm >= 1) time = mmdisp + ":" + ssdisp
        else time = ssdisp + "." + msdisp
        document.getElementById("bombClock").innerText = time
        var t = setTimeout(function(){currentBombTime()},17)
    }
    else {
        msdisp0 = ("" + msdisp0).split('')
        for (let x = 0; x < msdisp0.length; x++) {
            if (msdisp0[x] == ".") {
                msdisp0[x] = ''
                break
            }
        }
        msdisp0 = msdisp0.join('')
        if (mm >= 1) time = mmdisp + ":" + ssdisp + "." + msdisp0
        else time = ssdisp + "." + msdisp0
        document.getElementById("bombClock").innerText = time
    }
}
