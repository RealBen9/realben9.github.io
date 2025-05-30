import menu from "./menu/menu.js"
import sound from "./sound.js"
import locale from "./lang.js"
const SETTINGS_VERSION = 5
class Settings {
  constructor() {
    this.defaultSettings = {
      language: "en_US",
      // Tuning
      DAS: 150,
      ARR: 17,
      IRS: "tap",
      IHS: "tap",
      IAS: true,
      rotationSystem: "auto",
      spinDetectionType: "auto",
      useAre: true,
      useLineClearAre: true,
      stillShowFullActionTextDespiteZeroLineClearAre: false,
      shapeOverride: "tetro",
      useLockOut: true,
      brokenLineLimit: 40,
      // Graphics
      theme: "default",
      size: 100,
      nextLength: 6,
      skin: "auto",
      color: "auto",
      colorI: "auto",
      colorL: "auto",
      colorO: "auto",
      colorZ: "auto",
      colorT: "auto",
      colorJ: "auto",
      colorS: "auto",
      outline: "on",
      ghost: "color",
      backgroundOpacity: 30,
      gridStyle: "cross",
      lockFlash: "shine",
      actionText: true,
      matrixSwayScale: 50,
      matrixSwaySpeed: 50,
      visualInitial: true,
      particles: true,
      particleLimit: 1500,
      particleSize: 3,
      particleScale: 2,
      useLockdownBar: true,
      displayActionText: true,
      spinZ: true,
      spinL: true,
      spinO: true,
      spinS: true,
      spinI: true,
      spinJ: true,
      spinT: true,
      // Audio
      sfxVolume: 50,
      musicVolume: 50,
      voiceVolume: 100,
      soundbank: "auto",
      nextSoundbank: "auto",
      voicebank: "off",
    }
    switch (navigator.language.substr(0, 2)) {
      case "fr":
        this.defaultSettings.language = "fr_FR"
        break
      case "nl":
        this.defaultSettings.language = "nl_NL"
        break
      case "de":
        this.defaultSettings.language = "de_DE"
        break
      case "vi":
        this.defaultSettings.language = "vi_VN"
        break
      case "it":
        this.defaultSettings.language = "it_IT"
        break
      case "zh":
        this.defaultSettings.language = "zh_CN"
        break
      case "es":
        this.defaultSettings.language = "es_ES"
        break
      case "ja":
        this.defaultSettings.language = "ja_JP"
        break
      case "ko":
        this.defaultSettings.language = "ko_KR"
        break
      case "pl":
        this.defaultSettings.language = "pl_PL"
        break
      case "ru":
        this.defaultSettings.language = "ru_RU"
        break
    }
    switch (this.defaultSettings.language) {
      case "en_GB":
      case "en_US":
        this.defaultSettings.voicebank = "talonen"
        break
      case "de_DE":
        this.defaultSettings.voicebank = "talonde"
        break
      case "ja_JP":
        this.defaultSettings.voicebank = "sorajp"
        break
    }
    this.defaultControls = {
      moveLeft: ["ArrowLeft", "KeyA"],
      moveRight: ["ArrowRight", "KeyD"],
      hardDrop: ["ArrowUp", "Space", "KeyW"],
      softDrop: ["ArrowDown", "KeyS"],
      rotateLeft: ["KeyZ"],
      rotateRight: ["KeyX"],
      rotate180: ["KeyC"],
      hold: ["ShiftLeft", "ShiftRight"],
      retry: ["KeyR"],
      pause: ["Escape", "KeyP"],
    }
    this.defaultGame = {
      marathon: {
        startingLevel: 1,
        lineGoal: 150,
        levelCap: -1,
        big: false,
      },
      duality: {
        startingLevel: 1,
        lineGoal: 150,
        levelCap: -1,
        boards: 2,
      },
      sprint: {
        lineGoal: 40,
        regulationMode: false,
      },
      ultra: {
        timeLimit: 120000,
        useRta: false,
      },
      dynamic: {
        startingLevel: 0,
      },
      mystery: {
        startingLevel: 1,
        lineGoal: 150,
        levelCap: -1,
      },
      master: {
        startingLevel: 1,
        lockdownMode: "infinity",
        lockDelayMode: "Master",
        hold: true,
        lineGoal: 150,
        levelCap: -1,
      },
      survival: {
        startingLevel: 1,
        difficulty: 0,
        matrixWidth: 'narrow',
      },
      rise: {
        startingLevel: 1,
        riseSpeed: 1,
      },
      combo: {
        holdType: "hold",
      },
      strategy: {
        startingLevel: 1,
        hold: true,
      },
      killer: {
        startingLevel: 0,
        lockdownMode: "infinity",
        hold: true,
      },
      retro: {
        startingLevel: 0,
        mechanics: "accurate",
        compMode: false,
      },
      fall: {
        startingLevel: 0,
        mechanics: "accurate",
      },
      prox: {
        startingLevel: 1,
      },
      death: {
        startingLevel: 1,
      },
      handheld: {
        startingLevel: 0,
      },
      deluxe: {
        startingLevel: 0,
      },
      pandaemonium: {
        startingLevel: 0,
      },
      normal: {
        startingLevel: 0,
        ruleOption: false,
        infG: false,
        big: false,
        tls: false,
      },
      novice: {
        startingLevel: 0,
        ruleOption: false,
        infG: false,
        big: false,
        tls: false,
      },
      special: {
        startingLevel: 0,
        ruleOption: false,
        infG: false,
        big: false,
        tls: false,
      },
      sudden: {
        startingLevel: 0,
        ruleOption: false,
        big: false,
      },
      specialti: {
        startingLevel: 0,
        ruleOption: false,
        infG: false,
        big: false,
        tls: false,
      },
      suddenti: {
        startingLevel: 0,
        ruleOption: false,
        big: false,
      },
      beat: {
        song: "non",
      },
      pull: {
        startingLevel: 1,
        lockdownMode: "infinity",
      },
      zen: {
        lockdownMode: "zen",
        holdType: "hold",
        gravity: "0G",
        lockDelay: 500,
        matrixWidth: 10,
        lifeCount: 0,
        invisible: false,
        customBoard: false,
      },
    }
    this.settings = {}
    this.controls = {}
    this.game = {}
  }
  resetSettings() {
    this.settings = JSON.parse(JSON.stringify(this.defaultSettings))
  }
  resetControls() {
    this.controls = JSON.parse(JSON.stringify(this.defaultControls))
  }
  resetGame() {
    this.game = JSON.parse(JSON.stringify(this.defaultGame))
  }
  load() {
    for (const index of ["Settings", "Controls", "Game"]) {
      const loaded = JSON.parse(localStorage.getItem(`tetra${index}`))
      if (
        loaded === null ||
        parseInt(localStorage.getItem("tetraVersion")) !== SETTINGS_VERSION
      ) {
        this[`reset${index}`]()
      } else {
        this[index.toLowerCase()] = JSON.parse(JSON.stringify(loaded))
        if (index === "Game") {
          this[index.toLowerCase()] = {
            ...JSON.parse(JSON.stringify(this[`default${index}`])),
            ...JSON.parse(JSON.stringify(this[index.toLowerCase()])),
          }
          for (const key of Object.keys(this.defaultGame)) {
            this[index.toLowerCase()][key] = {
              ...JSON.parse(JSON.stringify(this[`default${index}`][key])),
              ...JSON.parse(JSON.stringify(this[index.toLowerCase()][key])),
            }
          }
          continue
        }
        this[index.toLowerCase()] = {
          ...JSON.parse(JSON.stringify(this[`default${index}`])),
          ...JSON.parse(JSON.stringify(this[index.toLowerCase()])),
        }
      }
    }
    this.saveAll()
  }
  saveSettings() {
    localStorage.setItem("tetraSettings", JSON.stringify(this.settings))
  }
  saveControls() {
    localStorage.setItem("tetraControls", JSON.stringify(this.controls))
  }
  saveGame() {
    localStorage.setItem("tetraGame", JSON.stringify(this.game))
  }
  saveVersion() {
    localStorage.setItem("tetraVersion", SETTINGS_VERSION)
  }
  saveAll() {
    this.saveSettings()
    this.saveControls()
    this.saveGame()
    this.saveVersion()
  }
  resetGameSpecific(mode) {
    this.game[mode] = this.defaultGame[mode]
  }
  changeSetting(setting, value, game) {
    if (game) {
      this.game[game][setting] = value
    } else {
      this.settings[setting] = value
    }
    sound.updateVolumes()
    if (game) {
      this.saveGame()
    }
    this.saveSettings()
  }
  getConflictingControlNames() {
    const keyFrequency = {}
    const duplicates = [""]
    for (const key of Object.keys(this.controls)) {
      for (const name of this.controls[key]) {
        if (keyFrequency[name] == null) {
          keyFrequency[name] = 1
        } else {
          keyFrequency[name]++
          duplicates.unshift(name)
        }
      }
    }
    return duplicates
  }
  addControl(key, control) {
    const array = this.controls[key]
    const index = array.indexOf(control)
    if (index === -1) {
      array.push(control)
    }
    this.saveControls()
    menu.drawControls()
  }
  removeControl(key, control) {
    const array = this.controls[key]
    const index = array.indexOf(control)
    if (index !== -1) {
      array.splice(index, 1)
    }
    this.saveControls()
    menu.drawControls()
  }
}
const settings = new Settings()
export default settings
