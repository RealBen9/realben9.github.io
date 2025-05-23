import buttonHints from './menu/button-hints.js'
import settings from './settings.js'
import menu from './menu/menu.js'
import gameHandler from './game/game-handler.js'
import $ from './shortcuts.js'
import locale from './lang.js'

class Input {
  constructor() {
    const keys = {
      menuUp: 'ArrowUp',
      menuDown: 'ArrowDown',
      menuLeft: 'ArrowLeft',
      menuRight: 'ArrowRight',
      menuOk: 'Enter',
      menuBack: 'Backspace',
    }
    this.controller = {
      moveLeft: ['DPAD_LEFT'],
      moveRight: ['DPAD_RIGHT'],
      hardDrop: ['DPAD_UP'],
      softDrop: ['DPAD_DOWN'],
      rotateLeft: ['FACE_1'],
      rotateRight: ['FACE_2'],
      rotate180: ['FACE_4'],
      hold: ['LEFT_TOP_SHOULDER', 'RIGHT_TOP_SHOULDER'],
      retry: ['SELECT_BACK'],
      pause: ['START_FORWARD'],
    }

    this.holdingCtrl = false
    this.holdingShift = false
    this.events = {}
    for (const name of Object.keys(keys)) {
      this.events[name] = new Event(name)
    }

    this.mouseLimit = 0
    this.currentGameKeys = {}
    this.lastGameKeys = {}
    for (const control of Object.keys(settings.defaultControls)) {
      this.currentGameKeys[control] = new Set()
      this.lastGameKeys[control] = new Set()
    }

    document.addEventListener('keydown', (event) => {
      if (event.key == 'o') {
        if (gameHandler.game != null) {
          if (gameHandler.game.isOver) {
            const fileContent = window.replay
            const bb = new Blob([fileContent], { type: 'JSON' })
            const a = document.createElement('a')
            a.download = window.replay.split("\n")[2] + '.tlorep'
            a.href = window.URL.createObjectURL(bb)
            a.click()
            a.remove()
          }
        }
      }
      if (event.key === 'Enter') {
        if (gameHandler.game != null) {
          if (gameHandler.game.isVisible && 
              !gameHandler.game.isPaused && 
              !gameHandler.game.isDead && 
              !gameHandler.game.isOver && 
              gameHandler.game.type === 'zen'
          ) {
            gameHandler.game.stack.addGarbageToCounter()
          }
        }
      }
      if (event.key !== 'Escape') {
        buttonHints.change('keyboard')
        buttonHints.show()
      }
      if (event.key === 'Control') {
        this.holdingCtrl = true
      }
      if (event.key === 'Shift') {
        this.holdingShift = true
      }
      if (event.code === 'Backspace') {
        if (gameHandler.game != null) {
          if (gameHandler.game.isVisible) {
            gameHandler.game.hide()
            gameHandler.game.pause()
            menu.open()
          } else {
            menu.back()
          }
        } else {
          menu.back()
        }
      }
      this.mouseLimit = 0
      $('#press-container').innerHTML = locale.getString('ui', 'pressKeyboardKey', ['<img src="img/ui/keyboard-enter.svg" class="press-key">'])
      for (const name of Object.keys(keys)) {
        if (event.key === keys[name]) {
          document.dispatchEvent(this.events[name])
        }
      }
      for (const key of Object.keys(settings.controls)) {
        if (settings.controls[key].indexOf(event.code) !== -1) {
          this.currentGameKeys[key].add(event.code)
        }
      }
    })
    document.addEventListener('keyup', (event) => {
      if (event.key === 'Control') {
        this.holdingCtrl = false
      }
      if (event.key === 'Shift') {
        this.holdingShift = false
      }
      for (const key of Object.keys(settings.controls)) {
        if (settings.controls[key].indexOf(event.code) !== -1) {
          this.currentGameKeys[key].delete(event.code)
        }
      }
    })
    document.addEventListener('mousemove', (event) => {
      this.mouseLimit++
      if (this.mouseLimit > 3) {
        $('#press-container').innerHTML = locale.getString('ui', 'clickAnywhere')
        buttonHints.hide()
      }
    })

    this.gamepad = new Gamepad()
    this.gamepad.bind(Gamepad.Event.BUTTON_DOWN, (e) => {
      // e.control of gamepad e.gamepad pressed down
      buttonHints.change('controller')
      buttonHints.show()

      if (e.control === 'DPAD_UP') {
        // document.dispatchEvent()
      }
      if (e.control === 'DPAD_DOWN') {
        menu.down()
      }
      if (e.control === 'FACE_1') {
        menu.ok()
      }
      if (e.control === 'FACE_2') {
        menu.back()
      }
    })
    if (!this.gamepad.init()) {
      // Your browser does not support gamepads, get the latest Google Chrome or Firefox
    }
  }
  add(event, func) {
    document.addEventListener(event, func)
  }
  addMany(eventArr, funcArr) {
    for (let i = 0; i < funcArr.length; i++) {
      const event = eventArr[i]
      const func = funcArr[i]
      this.add(event, func)
    }
  }
  updateGameInput() {
    if (!window.replaying) {
      for (const key of Object.keys(this.currentGameKeys)) {
        if (this.currentGameKeys[key].size !== this.lastGameKeys[key].size) {window.inputList.push(Math.floor(gameHandler.game.timePassed + gameHandler.game.timePassedAre),key,this.currentGameKeys[key].size)}
        this.lastGameKeys[key] = new Set(this.currentGameKeys[key])
      }
    } else {
      for (const key of Object.keys(this.currentGameKeys)) {
        this.lastGameKeys[key] = new Set(this.currentGameKeys[key])
      }
      window.lastRTA = window.currentRTA
      window.currentRTA = Math.floor(gameHandler.game.timePassed + gameHandler.game.timePassedAre)
      for (let i = window.lastRTA; i < window.currentRTA; i++) {
        if (window.repInputs[i] != null) {
          for (let j = 0; j < window.repInputs[i].length; j++) {
            const key = window.repInputs[i][j]
            const size = window.repInputs[i][j+1]
            this.currentGameKeys[key] = new Set()
            for (let k = 0; k < size; k++) {
              this.currentGameKeys[key].add(k)
            }
          }
        }
      }
      if (window.currentRTA > window.repInputs.length) {window.replaying = false}
    }
  }
  getGameDown(name) {
    if (this.currentGameKeys[name].size > 0) {
      return true
    }
    return false
  }
  getGamePress(name) {
    if (this.currentGameKeys[name].size > this.lastGameKeys[name].size) {
      return true
    }
    return false
  }
  getGameRelease(name) {
    if (this.currentGameKeys[name].size < this.lastGameKeys[name].size) {
      return true
    }
    return false
  }
}
const input = new Input()
export default input
