window.cfghold = 'ON'
window.cfgspin = '3CORNER'
window.cfgkick = 'SRS'
window.gravitystatic = 0
window.sdf = 2e7
window.lockdelaystatic = 500
window.cfggarbage = 'OFF'
window.cfgscore = 'GUIDELINE'
function btn_toggle(type, name) {
  switch (type) {
    case "cfghold":
      window.cfghold = name
      break
    case "cfgspin":
      window.cfgspin = name
      break
    case "cfgkick":
      window.cfgkick = name
      break
    case "cfggarbage":
      window.cfggarbage = name
      break
    case "cfgscore":
      window.cfgscore = name
      break
  }
  panel = document.getElementById(type)
  buttons = panel.getElementsByTagName("button")
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove("selected")
    if (buttons[i].innerHTML == name) {buttons[i].classList.add("selected")}
  }
}
function btn_submit(type) {
  inputval = document.getElementById(type).value-0
  if (type == "gravitystatic") {
    window.gravitystatic = inputval
    if (window.gravitystatic == 0) {
      window.sdf = 2e7
    }
    else {
      window.sdf = 20
    }
  }
  else if (type == "lockdelaystatic") {window.lockdelaystatic = inputval}
}