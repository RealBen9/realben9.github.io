/* This file needs to be modified to allow for custom gamemodes */
import $, {bpmToMs, framesToMs, resetAnimation, roundBpmToMs, roundMsToFrames} from '../shortcuts.js'
import {gravity, classicGravity, deluxeGravity} from './loop-modules/gravity.js'
import {PIECE_COLORS, SOUND_SETS} from '../consts.js'
import addStaticScore from './loop-modules/add-static-score.js'
import arcadeScore from './loop-modules/arcade-score.js'
import collapse from './loop-modules/collapse.js'
import firmDrop from './loop-modules/firm-drop.js'
import gameHandler from './game-handler.js'
import handheldDasAre from './loop-modules/handheld-das-are.js'
import hardDrop from './loop-modules/hard-drop.js'
import hold from './loop-modules/hold.js'
import hyperSoftDrop from './loop-modules/hyper-soft-drop.js'
import initialDas from './loop-modules/initial-das.js'
import initialHold from './loop-modules/initial-hold.js'
import initialRotation from './loop-modules/initial-rotation.js'
import linesToLevel from './loop-modules/lines-to-level.js'
import lockFlash from './loop-modules/lock-flash.js'
import respawnPiece from './loop-modules/respawn-piece.js'
import rotate from './loop-modules/rotate.js'
import rotate180 from './loop-modules/rotate-180.js'
import shifting from './loop-modules/shifting.js'
import shiftingRetro from './loop-modules/shifting-retro.js'
import sonicDrop from './loop-modules/sonic-drop.js'
import softDrop from './loop-modules/soft-drop.js'
import softDropRetro from './loop-modules/soft-drop-retro.js'
import softDropNes from './loop-modules/soft-drop-nes.js'
import sound from '../sound.js'
import updateLasts from './loop-modules/update-lasts.js'
import {extendedLockdown, retroLockdown, classicLockdown, infiniteLockdown, beatLockdown, zenLockdown} from './loop-modules/lockdown.js'
import updateFallSpeed from './loop-modules/update-fallspeed.js'
import shiftingNes from './loop-modules/shifting-nes.js'
import nesDasAre from './loop-modules/nes-das-are.js'
import settings from '../settings.js'
import input from '../input.js'
import locale from '../lang.js'
import rotateReverse from './loop-modules/rotate-reverse.js'
let lastLevel = 0
let garbageTimer = 0
let shown20GMessage = false
let shownHoldWarning = false
let lastSeenI = 0
let nonEvents = []
let bpm
const levelUpdate = (game) => {
  let returnValue = false
  if (game.stat.level !== lastLevel) {
    sound.add('levelup')
    game.stack.levelUpAnimation = 0
    if (game.stat.level % 5 === 0) {
      sound.add('levelupmajor')
    } else {
      sound.add('levelupminor')
    }
    returnValue = true
  }
  lastLevel = game.stat.level
  return returnValue
}
export const loops = {
  sudden: {
    update: (arg) => {
      const game = gameHandler.game
      game.rta += arg.ms
      game.b2b = 0
      arcadeScore(arg)
      linesToLevel(arg, 999, 100)
      game.endSectionLevel = game.stat.level >= 900 ? 999 : Math.floor((game.stat.level / 100) + 1) * 100
      game.appends.level = `<span class="small">/${game.endSectionLevel}</span>`
      if (game.stat.level >= 999) game.stat.grade = "GM"
      else if (game.stat.level >= 500 && game.torikanPassed) game.stat.grade = "M"
      collapse(arg)
      if (arg.piece.inAre) {
        initialDas(arg)
        initialRotation(arg)
        initialHold(arg)
        arg.piece.are += arg.ms
      } else {
        respawnPiece(arg)
        rotate(arg)
        shifting(arg)
      }
      gravity(arg)
      sonicDrop(arg, true)
      firmDrop(arg, 1, true)
      classicLockdown(arg)
      if (!arg.piece.inAre) {
        hold(arg)
      }
      lockFlash(arg)
      updateLasts(arg)
    },
    onInit: (game) => {
      if (settings.game.sudden.big == false) {
        game.settings.width = 10
        game.settings.height = 20
        game.stack.width = 10
        game.stack.height = 20
        game.stack.new()
        game.piece.xSpawnOffset = 0
        game.resize()
      }
      game.stat.level = settings.game.sudden.startingLevel
      if (game.stat.level != 0 || settings.game.sudden.big == true) {
        $('#next-label').style.animationName = "hurry-up-timer"
        $('#next-label').style.animationDuration = "0.4s"
        $('#next-label').style.animationIterationCount = "infinite"
        $('#next-label').style.animationDirection = "alternate"
        $('#next-label').style.animationTimingFunction = "ease-in-out"
        $('#next-label').style.fontSize = "1.3em"
      }
      game.isRaceMode = true
      game.stat.grade = ""
      game.rta = 0
      game.piece.gravity = framesToMs(1 / 20)
      game.torikanPassed = false
      game.stat.initPieces = 2
      game.endingStats.grade = true
      game.musicProgression = 0
      game.drop = 0
      if (settings.game.sudden.ruleOption == false) {
        game.settings.rotationSystem = "srs"
        game.rotationSystem = "srs"
        if (settings.game.sudden.startingLevel == 0) $('#levelType').innerHTML = '<font color="#f66">Sudden (0S)</font>'
        else $('#levelType').innerHTML = '<font color="#f66">Sudden (' + settings.game.sudden.startingLevel + '0S)</font>'
      } else {
        game.settings.rotationSystem = "ars"
        game.rotationSystem = "ars"
        if (settings.game.sudden.startingLevel == 0) $('#levelType').innerHTML = '<font color="#66f">Sudden (Classic, 0S)</font>'
        else $('#levelType').innerHTML = '<font color="#66f">Sudden (Classic, ' + settings.game.sudden.startingLevel + '0S)</font>'
      }
      $('#zen_panel').style.display = "none"
      game.updateStats()
    },
    onPieceSpawn: (game) => {
      const areTable = [[101,18],[301,14],[401,8],[500,7],[1000,6]]
      const areLineModifierTable = [[101,-4],[301,-6],[1000,0]]
      const areLineTable = [[101,12],[401,6],[500,5],[1000,4]]
      const dasTable = [[200,12],[300,11],[400,10],[1000,8]]
      const lockDelayTable = [[101,30],[201,26],[301,22],[401,18],[1000,15]]
      const musicProgressionTable = [[279,1],[300,2],[479,3],[500,4]]
      for (const pair of areTable) {
        const level = pair[0]
        const entry = pair[1]
        if (game.stat.level < level) {
          game.piece.areLimit = framesToMs(entry)
          break
        }
      }
      for (const pair of areLineModifierTable) {
        const level = pair[0]
        const entry = pair[1]
        if (game.stat.level < level) {
          game.piece.areLimitLineModifier = framesToMs(entry)
          break
        }
      }
      for (const pair of areLineTable) {
        const level = pair[0]
        const entry = pair[1]
        if (game.stat.level < level) {
          game.piece.areLineLimit = framesToMs(entry)
          break
        }
      }
      for (const pair of dasTable) {
        const level = pair[0]
        const entry = pair[1]
        if (game.stat.level < level) {
          game.piece.dasLimit = framesToMs(entry)
          break
        }
      }
      for (const pair of lockDelayTable) {
        const level = pair[0]
        const entry = pair[1]
        if (game.stat.level < level) {
          game.piece.lockDelayLimit = Math.ceil(framesToMs(entry))
          break
        }
      }
      for (const pair of musicProgressionTable) {
        const level = pair[0]
        const entry = pair[1]
        if (game.stat.level >= level && game.musicProgression < entry) {
          switch (entry) {
            case 1:
            case 3:
              sound.killBgm()
              break
            case 2:
              sound.loadBgm(["survival"], "survival")
              sound.killBgm()
              sound.playBgm(["survival"], "survival")
              break
            case 4:
              sound.loadBgm(["master-last"], "master")
              sound.killBgm()
              sound.playBgm(["master-last"], "master")
          }
          game.musicProgression = entry
        }
      }
      if (game.stat.level >= 500 && game.rta <= 205000) game.torikanPassed = true
      else if ((game.stat.level >= 500 && !game.torikanPassed) || game.stat.level === 999) {
        if (game.stat.level < 999) game.stat.level = 500
        $('#kill-message').textContent = locale.getString('ui', 'excellent')
        sound.killVox()
        sound.add('voxexcellent')
        game.end(true)
      }
      if (game.stat.initPieces === 0 && (game.stat.level % 100 !== 99 && game.stat.level !== 998)) {game.stat.level++}
      if (game.stat.initPieces > 0) {game.stat.initPieces = game.stat.initPieces - 1}
      updateFallSpeed(game)
    }
  },
  novice: {
    update: (arg) => {
      gameHandler.game.b2b = 0
      gameHandler.game.rta += arg.ms
      if (input.getGameDown('softDrop')) {gameHandler.game.drop += arg.ms}
      if (input.getGamePress('hardDrop')) {gameHandler.game.drop += framesToMs(2 * arg.piece.getDrop())}
      arcadeScore(arg, roundMsToFrames(gameHandler.game.drop), 6)
      linesToLevel(arg, 300, 300)
      collapse(arg)
      if (arg.piece.inAre) {
        initialDas(arg)
        initialRotation(arg)
        initialHold(arg)
        arg.piece.are += arg.ms
      } else {
        respawnPiece(arg)
        rotate(arg)
        shifting(arg)
      }
      gravity(arg)
      sonicDrop(arg)
      firmDrop(arg)
      classicLockdown(arg)
      if (!arg.piece.inAre) {
        hold(arg)
      }
      lockFlash(arg)
      updateLasts(arg)
    },
    onPieceSpawn: (game) => {
      game.drop = 0
      if (game.stat.level === 300) {
        game.stat.score += Math.max(0, (300 - Math.floor(game.rta / 1000)) * 1253)
        $('#kill-message').textContent = locale.getString('ui', 'excellent')
        sound.killVox()
        sound.add('voxexcellent')
        game.end(true)
      } else if (game.stat.initPieces === 0 && game.stat.level !== 299) {game.stat.level++}
      else {game.stat.initPieces = game.stat.initPieces - 1}
      if (game.stat.level >= 280) {sound.killBgm()}
      let gravityDenominator = 1
      const gravityTable = [
        [8,4],[19,5],[35,6],[40,8],[50,10],[60,12],[70,16],[80,32],[90,48],[100,64],
        [108,4],[119,5],[125,6],[131,8],[139,12],[149,32],[156,48],[164,80],[174,112],
        [180,128],[200,144],[212,16],[221,48],[232,80],[244,112],[256,144],[267,176],
        [277,192],[287,208],[295,224],[300,240]
      ]
      for (const pair of gravityTable) {
        const level = pair[0]
        const denom = pair[1]
        if (game.stat.level < level) {
          gravityDenominator = denom
          break
        }
      }
      if (settings.game.novice.infG == false) {game.piece.gravity = framesToMs(256 / gravityDenominator)}
      else {game.piece.gravity = framesToMs(1 / 20)}
      if (settings.game.novice.tls == false) {game.piece.ghostIsVisible = game.stat.level < 100}
      else {game.piece.ghostIsVisible = true}
      updateFallSpeed(game)
    },
    onInit: (game) => {
      if (settings.game.novice.big == false) {
        game.settings.width = 10
        game.settings.height = 20
        game.stack.width = 10
        game.stack.height = 20
        game.stack.new()
        game.piece.xSpawnOffset = 0
        game.resize()
      }
      game.stat.level = settings.game.novice.startingLevel
      if (game.stat.level != 0 || settings.game.novice.infG == true || settings.game.novice.big == true || settings.game.novice.tls == true) {
        $('#next-label').style.animationName = "hurry-up-timer"
        $('#next-label').style.animationDuration = "0.4s"
        $('#next-label').style.animationIterationCount = "infinite"
        $('#next-label').style.animationDirection = "alternate"
        $('#next-label').style.animationTimingFunction = "ease-in-out"
        $('#next-label').style.fontSize = "1.3em"
      }
      game.rta = 0
      game.isRaceMode = true
      game.arcadeCombo = 1
      game.drop = 0
      game.stat.initPieces = 2
      game.appends.level = `<span class="small">/300</span>`
      if (settings.game.novice.ruleOption == false) {
        game.settings.rotationSystem = "srs"
        game.rotationSystem = "srs"
        if (settings.game.novice.startingLevel == 0) $('#levelType').innerHTML = '<font color="#f66">Novice (0S)</font>'
        else $('#levelType').innerHTML = '<font color="#f66">Novice (' + settings.game.novice.startingLevel + '0S)</font>'
      } else {
        game.settings.rotationSystem = "ars"
        game.rotationSystem = "ars"
        if (settings.game.novice.startingLevel == 0) $('#levelType').innerHTML = '<font color="#66f">Novice (Classic, 0S)</font>'
        else $('#levelType').innerHTML = '<font color="#66f">Novice (Classic, ' + settings.game.novice.startingLevel + '0S)</font>'
      }
      $('#zen_panel').style.display = "none"
      updateFallSpeed(game)
      game.updateStats()
    },
  },
  marathon: {
    update: (arg) => {
      collapse(arg)
      if (arg.piece.inAre) {
        initialDas(arg)
        initialRotation(arg)
        initialHold(arg)
        arg.piece.are += arg.ms
      } else {
        respawnPiece(arg)
        rotate(arg)
        rotate180(arg)
        shifting(arg)
      }
      gravity(arg)
      softDrop(arg)
      hardDrop(arg)
      extendedLockdown(arg)
      if (!arg.piece.inAre) {
        hold(arg)
      }
      lockFlash(arg)
      updateLasts(arg)
      /* Might use this code later
      $('#das').max = arg.piece.dasLimit
      $('#das').value = arg.piece.das
      $('#das').style.setProperty('--opacity', ((arg.piece.arr >= arg.piece.arrLimit) || arg.piece.inAre) ? 1 : 0)
      */
    },
    onPieceSpawn: (game) => {
      game.stat.level = Math.max(settings.game.marathon.startingLevel, Math.floor(game.stat.line / 10 + 1))
      if (settings.game.marathon.levelCap >= 0) {
        game.stat.level = Math.min(game.stat.level, settings.game.marathon.levelCap)
      }
      const x = game.stat.level
      const gravityEquation = (0.8 - ((x - 1) * 0.007)) ** (x - 1)
      game.piece.gravity = Math.max(gravityEquation * 1000, framesToMs(1 / 20))
      if (game.stat.level >= 20) {
        game.piece.lockDelayLimit = ~~framesToMs((30 * Math.pow(0.93, (Math.pow(game.stat.level - 20, 0.8)))))
      } else {
        game.piece.lockDelayLimit = 500
      }
      updateFallSpeed(game)
      levelUpdate(game)
    },
    onInit: (game) => {
      if (settings.game.marathon.lineGoal >= 0) {
        game.lineGoal = settings.game.marathon.lineGoal
        $('#levelType').innerHTML = "Marathon (" + settings.game.marathon.lineGoal + "L, " + settings.game.marathon.startingLevel + "S)"
      }
      else $('#levelType').innerHTML = "Marathon (∞L, " + settings.game.marathon.startingLevel + "S)"
      game.stat.level = settings.game.marathon.startingLevel
      lastLevel = parseInt(settings.game.marathon.startingLevel)
      game.piece.gravity = 1000
      $('#zen_panel').style.display = "none"
      updateFallSpeed(game)
      game.updateStats()
    },
  },
  ic4w: {
    update: (arg) => {
      collapse(arg)
      if (arg.piece.inAre) {
        initialDas(arg)
        initialRotation(arg)
        initialHold(arg)
        arg.piece.are += arg.ms
      } else {
        respawnPiece(arg)
        rotate(arg)
        rotate180(arg)
        shifting(arg)
      }
      gravity(arg)
      softDrop(arg)
      hardDrop(arg)
      extendedLockdown(arg)
      if (!arg.piece.inAre) {
        hold(arg)
      }
      lockFlash(arg)
      updateLasts(arg)
      /* Might use this code later
      $('#das').max = arg.piece.dasLimit
      $('#das').value = arg.piece.das
      $('#das').style.setProperty('--opacity', ((arg.piece.arr >= arg.piece.arrLimit) || arg.piece.inAre) ? 1 : 0)
      */
    },
    onPieceSpawn: (game) => {
      game.stat.level = Math.max(settings.game.marathon.startingLevel, Math.floor(game.stat.line / 10 + 1))
      if (settings.game.marathon.levelCap >= 0) {
        game.stat.level = Math.min(game.stat.level, settings.game.marathon.levelCap)
      }
      const x = game.stat.level
      const gravityEquation = (0.8 - ((x - 1) * 0.007)) ** (x - 1)
      game.piece.gravity = Math.max(gravityEquation * 1000, framesToMs(1 / 20))
      if (game.stat.level >= 20) {
        game.piece.lockDelayLimit = ~~framesToMs((30 * Math.pow(0.93, (Math.pow(game.stat.level - 20, 0.8)))))
      } else {
        game.piece.lockDelayLimit = 500
      }
      updateFallSpeed(game)
      levelUpdate(game)
    },
    onInit: (game) => {
      $('#levelType').innerHTML = "IC4W"
      if (settings.game.marathon.lineGoal >= 0) {
        game.lineGoal = settings.game.marathon.lineGoal
      }
      game.stat.level = settings.game.marathon.startingLevel
      lastLevel = parseInt(settings.game.marathon.startingLevel)
      game.piece.gravity = 1000
      $('#zen_panel').style.display = "none"
      updateFallSpeed(game)
      game.updateStats()
    },
  },
  big: {
    update: (arg) => {
      collapse(arg)
      if (arg.piece.inAre) {
        initialDas(arg)
        initialRotation(arg)
        initialHold(arg)
        arg.piece.are += arg.ms
      } else {
        respawnPiece(arg)
        rotate(arg)
        rotate180(arg)
        shifting(arg)
      }
      gravity(arg)
      softDrop(arg)
      hardDrop(arg)
      extendedLockdown(arg)
      if (!arg.piece.inAre) {
        hold(arg)
      }
      lockFlash(arg)
      updateLasts(arg)
      /* Might use this code later
      $('#das').max = arg.piece.dasLimit
      $('#das').value = arg.piece.das
      $('#das').style.setProperty('--opacity', ((arg.piece.arr >= arg.piece.arrLimit) || arg.piece.inAre) ? 1 : 0)
      */
    },
    onPieceSpawn: (game) => {
      game.stat.level = Math.max(settings.game.marathon.startingLevel, Math.floor(game.stat.line / 10 + 1))
      if (settings.game.marathon.levelCap >= 0) {
        game.stat.level = Math.min(game.stat.level, settings.game.marathon.levelCap)
      }
      const x = game.stat.level
      const gravityEquation = (0.8 - ((x - 1) * 0.007)) ** (x - 1)
      game.piece.gravity = Math.max(gravityEquation * 1000, framesToMs(1 / 20))
      if (game.stat.level >= 20) {
        game.piece.lockDelayLimit = ~~framesToMs((30 * Math.pow(0.93, (Math.pow(game.stat.level - 20, 0.8)))))
      } else {
        game.piece.lockDelayLimit = 500
      }
      updateFallSpeed(game)
      levelUpdate(game)
    },
    onInit: (game) => {
      $('#levelType').innerHTML = "Big"
      if (settings.game.marathon.lineGoal >= 0) {
        game.lineGoal = settings.game.marathon.lineGoal
      }
      game.stat.level = settings.game.marathon.startingLevel
      lastLevel = parseInt(settings.game.marathon.startingLevel)
      game.piece.gravity = 1000
      $('#zen_panel').style.display = "none"
      updateFallSpeed(game)
      game.updateStats()
    },
  },
  zen: {
    update: (arg) => {
      collapse(arg)
      if (arg.piece.inAre) {
        initialDas(arg)
        initialRotation(arg)
        initialHold(arg)
        arg.piece.are += arg.ms
      } else {
        respawnPiece(arg)
        rotate(arg)
        rotate180(arg)
        shifting(arg)
      }
      gravity(arg)
      softDrop(arg, window.sdf, true)
      hardDrop(arg)
      switch (settings.game.zen.lockdownMode) {
        case "zen":
          zenLockdown(arg)
          break
        case "infinity":
          infiniteLockdown(arg)
          break
        case "extended":
          extendedLockdown(arg)
          break
        case "classic":
          classicLockdown(arg)
          break
      }
      if (!arg.piece.inAre) {
        hold(arg)
      }
      lockFlash(arg)
      updateLasts(arg)
    },
    onPieceSpawn: (game) => {
      game.stat.b2b = game.b2b - 1 < 0 ? 0 : game.b2b - 1
      game.updateStats()
      game.piece.spinDetectionType = window.cfgspin.toLowerCase()
      game.settings.rotationSystem = window.cfgkick.toLowerCase()
      game.rotationSystem = window.cfgkick.toLowerCase()
      if (window.gravitystatic == 0) {
        game.piece.gravity = 1e9
      }
      else {
        game.piece.gravity = framesToMs(1 / window.gravitystatic)
      }
      game.piece.lockDelayLimit = window.lockdelaystatic
      game.settings.scoreTable = window.cfgscore.toLowerCase()
    },
    onInit: (game) => {
      $('#zen_panel').style.display = ""
      $('#levelType').innerHTML = "Zen"
      game.settings.width = settings.game.zen.matrixWidth
      game.stack.width = settings.game.zen.matrixWidth
      game.stack.new()
      game.piece.xSpawnOffset = Math.floor((settings.game.zen.matrixWidth - 10) / 2)
      game.resize()
      if (settings.game.zen.holdType === "skip") {
        game.hold.useSkip = true
        // game.hold.holdAmount = 2
        // game.hold.holdAmountLimit = 2
        // game.hold.gainHoldOnPlacement = true
        // game.resize()
      }
      if (settings.game.zen.holdType == "disabled") {
        game.hold.isDisabled = true
      } else {
        game.hold.isDisabled = false
      }
      game.stat.level = 1
      // game.piece.gravity = 1000
      // updateFallSpeed(game)
      // game.stat.b2b = 0
      // game.updateStats()
      if (window.gravitystatic == 0) {
        game.piece.gravity = 1e9
      }
      else {
        game.piece.gravity = framesToMs(1 / window.gravitystatic)
      }
      game.piece.lockDelayLimit = window.lockdelaystatic
      game.lives = settings.game.zen.lifeCount
      game.stack.isInvisible = settings.game.zen.invisible
      if (settings.game.zen.customBoard == true) {
        function escape(s) { return s.replace(/([.*+?\^$(){}|\[\]\/\\])/g, '\\$1'); }
        window.cookieMatch = document.cookie.match(RegExp('(?:^|;\\s*)' + escape("TlBeSaVe") + '=([^;]*)'));
        window.cookieData = window.cookieMatch ? window.cookieMatch[1] : "";
        window.boardString = prompt("Enter your custom board string (may connect to tlbe via cookies) :", window.cookieData)
        if (window.boardString != null) {
          for (let x = 0; x < settings.game.zen.matrixWidth; x++) {
            for (let y = 0; y < 20; y++) {
              window.gridtemp = window.boardString[x + (y * settings.game.zen.matrixWidth)]
              if (window.gridtemp == 1) window.gridtemp = 'red'
              else if (window.gridtemp == 2) window.gridtemp = 'orange'
              else if (window.gridtemp == 3) window.gridtemp = 'yellow'
              else if (window.gridtemp == 4) window.gridtemp = 'green'
              else if (window.gridtemp == 5) window.gridtemp = 'lightBlue'
              else if (window.gridtemp == 6) window.gridtemp = 'blue'
              else if (window.gridtemp == 7) window.gridtemp = 'purple'
              else if (window.gridtemp == 8) window.gridtemp = 'white'
              else if (window.gridtemp == 9) window.gridtemp = 'black'
              else window.gridtemp = undefined
              game.stack.grid[x][game.stack.height + game.stack.hiddenHeight - 1 - y] = gridtemp
            }
          }
        }
      }
    },
  },
  beat: {
    update: (arg) => {
      const game = gameHandler.game
      let respawn = false
      if (arg.piece.startingAre >= arg.piece.startingAreLimit) {
        game.beatTime += arg.ms
      }
      collapse(arg)
      if (arg.piece.inAre) {
        initialDas(arg)
        initialRotation(arg)
        initialHold(arg)
        arg.piece.are += arg.ms
      } else {
        rotate(arg)
        rotate180(arg)
        shifting(arg)
      }
      gravity(arg)
      softDrop(arg)
      if (input.getGamePress('hardDrop')) {
        if (!arg.piece.isFrozen) {
          sound.add('lockforce')
        }
        arg.piece.isFrozen = true
      }
      while (game.beatTime > bpmToMs(bpm)) {
        arg.piece.hardDrop()
        respawn = true
        game.beatTime -= bpmToMs(bpm)
      }
      beatLockdown(arg)
      if (!arg.piece.inAre) {
        hold(arg)
      }
      if (respawn) {
        respawnPiece(arg)
      }
      // for (let i = 0 i < events.length i++) {
      //   const event = events[i]
      //   if (event[0] <= game.timePassed) {
      //     const eType = event[1]
      //     if (eType === 'flashBg') {
      //       console.log('flash')
      //     }
      //     events.splice(i, 1)
      //     i--
      //   } else {
      //     break
      //   }
      // }
      lockFlash(arg)
      updateLasts(arg)
    },
    onPieceSpawn: (game) => {
      game.piece.gravity = framesToMs(1 / 20)
      game.piece.lockDelayLimit = roundBpmToMs(bpm)
    },
    onInit: (game) => {
      switch(settings.game.beat.song){
        case 'non':
          $('#levelType').innerHTML = "Beat Mode 180 (Night of Nights)"
          bpm = 180
          break
        case 'beat':
          bpm = 166
          $('#levelType').innerHTML = "Beat Mode 166 (Ludicrous Speed)"
          break
        case 'ritn':
          bpm = 158.5
          $('#levelType').innerHTML = "Beat Mode 158.5 (Running in the 90's)"
          break
      }
      /* game.isRaceMode = true */
      $('#zen_panel').style.display = "none"
      game.beatTime = bpmToMs(bpm)
      game.updateStats()
    },
  },
  nontwo: {
    update: (arg) => {
      collapse(arg)
      const game = gameHandler.game
      const timePassed = game.timePassed + game.timePassedAre
      if (arg.piece.inAre) {
        initialDas(arg)
        initialRotation(arg)
        initialHold(arg)
        arg.piece.are += arg.ms
      } else {
        respawnPiece(arg)
        if (timePassed > 54830 && timePassed < 63660) {
          rotateReverse(arg)
        } else {
          rotate(arg)
        }
        rotate180(arg)
        shifting(arg)
      }
      if (game.hold.isDisabled) {
        classicGravity(arg)
      } else {
        gravity(arg)
      }
      hyperSoftDrop(arg)
      hardDrop(arg)
      if (timePassed > 32000 && timePassed < 42660) {
        const calcNum = 42660 - 32000
        arg.piece.lockDelayLimit = Math.round(500 - ((timePassed - 32000) / calcNum) * 300)
        $('#delay').innerHTML = `${Math.round(arg.piece.lockDelayLimit)} <b>ms</b>`
        $('#delay').classList.add('danger')
      } else {
        $('#delay').classList.remove('danger')
        arg.piece.lockDelayLimit = 500
      }
      if (game.hold.isDisabled) {
        retroLockdown(arg, false)
      } else {
        classicLockdown(arg)
      }
      if (!arg.piece.inAre) {
        hold(arg)
      }
      while (
        (((nonEvents[0][0] - 1) * 16) + (nonEvents[0][1] - 1)) * (1 / 12) * 1000
        <= timePassed) {
        const eType = nonEvents[0][2]
        switch (eType) {
        case 'flashBg':
          resetAnimation('body', 'non-flash')
          break
        case 'gravChange':
          arg.piece.gravity = nonEvents[0][3]
          break
        case 'silOn':
          $('#game-container').classList.add('sil')
          break
        case 'silOff':
          $('#game-container').classList.remove('sil')
          break
        case 'silBoardOn':
          $('#stack').classList.add('sil')
          break
        case 'silBoardOff':
          $('#stack').classList.remove('sil')
          break
        case 'silPieceOn':
          $('#piece').classList.add('sil')
          break
        case 'silPieceOff':
          $('#piece').classList.remove('sil')
          break
        case 'setFlashSpeed':
          $('body').style.setProperty('--flash-speed', `${nonEvents[0][3]}s`)
          break
        case 'transform':
          const x = nonEvents[0][3]
          $('#game-container').style.transform = `perspective(${x[0]}em) translateX(${x[1]}em) translateY(${x[2]}em) translateZ(${x[3]}em) rotateX(${x[4]}deg) rotateY(${x[5]}deg) rotateZ(${x[6]}deg)`
          break
        case 'tranFunc':
            $('#game-container').style.transitionTimingFunction = nonEvents[0][3]
            break
        case 'tranSpeed':
          $('#game-container').style.transitionProperty = `transform`
          $('#game-container').style.transitionDuration = `${nonEvents[0][3]}s`
          break
        case 'showMessage':
          $('#message').innerHTML = nonEvents[0][3]
          resetAnimation('#message', 'dissolve')
          break
        case 'changeNext':
          game.next.nextLimit = nonEvents[0][3]
          game.next.isDirty = true
          break
        case 'startRetro':
          game.hold.isDirty = true
          game.hold.isDisabled = true
          game.piece.ghostIsVisible = false
          game.next.nextLimit = 1
          game.next.isDirty = true
          break
        case 'endRetro':
          game.hold.isDirty = true
          game.hold.isDisabled = false
          game.piece.ghostIsVisible = true
          game.next.nextLimit = 6
          game.next.isDirty = true
          break
        }
        nonEvents.shift()
      }
      lockFlash(arg)
      updateLasts(arg)
    },
    onPieceSpawn: (game) => {

    },
    onInit: (game) => {
      $('#levelType').innerHTML = "Night of Nights X"
      game.timeGoal = 140000
      game.rtaLimit = true
      game.stat.level = 1
      const PERS = 35
      game.hideGrid = true
      game.stack.updateGrid()
      nonEvents = [
        [1, 1, 'tranFunc', 'linear'],
        [1, 1, 'gravChange', 16.6666666667],
        [3, 1, 'showMessage', '<small style="font-size: .75em">Night of Nights X'],
        [5, 1, 'setFlashSpeed', 0.7],
        [5, 1, 'flashBg'],
        [5, 1, 'silOn'],
        [5, 13, 'flashBg'],
        [6, 1, 'flashBg'],
        [6, 13, 'flashBg'],
        [7, 1, 'flashBg'],
        [7, 9, 'flashBg'],
        [8, 1, 'flashBg'],
        [8, 5, 'flashBg'],
        [8, 9, 'flashBg'],
        [8, 13, 'flashBg'],
        [8, 16, 'silOff'],
        [8, 16, 'silBoardOn'],
        [9, 1, 'setFlashSpeed', 0.03],
        [9, 1, 'flashBg'],
        [9, 1, 'transform', [PERS, 0, 0, -25, 10, 10, 30]],
        [9, 2, 'tranSpeed', 10],
        [9, 3, 'transform', [PERS, 0, 0, 10, 0, 0, 0]],
        [9, 3, 'flashBg'],
        [9, 5, 'flashBg'],
        [9, 6, 'flashBg'],
        [9, 8, 'flashBg'],
        [9, 10, 'flashBg'],
        [9, 12, 'flashBg'],
        [9, 13, 'flashBg'],
        [9, 14, 'flashBg'],
        [9, 15, 'flashBg'],
        [9, 16, 'flashBg'],
        [10, 2, 'flashBg'],
        [10, 3, 'flashBg'],
        [10, 5, 'flashBg'],
        [10, 6, 'flashBg'],
        [10, 8, 'flashBg'],
        [10, 10, 'flashBg'],
        [10, 12, 'flashBg'],
        [10, 13, 'flashBg'],
        [10, 15, 'flashBg'],
        [11, 1, 'flashBg'],
        [11, 3, 'flashBg'],
        [11, 5, 'flashBg'],
        [11, 6, 'flashBg'],
        [11, 8, 'flashBg'],
        [11, 10, 'flashBg'],
        [11, 12, 'flashBg'],
        [11, 13, 'flashBg'],
        [11, 14, 'flashBg'],
        [11, 15, 'flashBg'],
        [11, 16, 'flashBg'],
        [12, 2, 'flashBg'],
        [12, 3, 'flashBg'],
        [12, 5, 'flashBg'],
        [12, 6, 'flashBg'],
        [12, 8, 'flashBg'],
        [12, 10, 'flashBg'],
        [12, 12, 'flashBg'],
        [12, 13, 'flashBg'],
        [12, 15, 'flashBg'],
        [13, 1, 'flashBg'],
        [13, 3, 'flashBg'],
        [13, 5, 'flashBg'],
        [13, 6, 'flashBg'],
        [13, 8, 'flashBg'],
        [13, 10, 'flashBg'],
        [13, 12, 'flashBg'],
        [13, 13, 'flashBg'],
        [13, 14, 'flashBg'],
        [13, 15, 'flashBg'],
        [13, 16, 'flashBg'],
        [14, 2, 'flashBg'],
        [14, 3, 'flashBg'],
        [14, 5, 'flashBg'],
        [14, 6, 'flashBg'],
        [14, 8, 'flashBg'],
        [14, 10, 'flashBg'],
        [14, 12, 'flashBg'],
        [14, 13, 'flashBg'],
        [14, 15, 'flashBg'],
        [15, 1, 'flashBg'],
        [15, 3, 'flashBg'],
        [15, 5, 'flashBg'],
        [15, 6, 'flashBg'],
        [15, 8, 'flashBg'],
        [15, 10, 'flashBg'],
        [15, 12, 'flashBg'],
        [15, 13, 'flashBg'],
        [15, 14, 'flashBg'],
        [15, 15, 'flashBg'],
        [15, 16, 'flashBg'],
        [16, 2, 'flashBg'],
        [16, 3, 'flashBg'],
        [16, 5, 'flashBg'],
        [16, 6, 'flashBg'],
        [16, 8, 'flashBg'],
        [16, 10, 'flashBg'],
        [16, 12, 'flashBg'],
        [16, 13, 'flashBg'],
        [16, 15, 'flashBg'],
        [16, 15, 'tranSpeed', .5],
        [16, 15, 'tranFunc', 'cubic-bezier(0.030, 0.935, 0.050, 0.970)'],
        [17, 1, 'setFlashSpeed', 0.5],
        [17, 1, 'flashBg'],
        [17, 1, 'transform', [PERS, 0, 0, -10, Math.random() * 80 - 40, Math.random() * 80 - 40, Math.random() * 80 - 40]],
        [18, 13, 'flashBg'],
        [18, 13, 'transform', [PERS, 0, 0, -10, Math.random() * 80 - 40, Math.random() * 80 - 40, Math.random() * 80 - 40]],
        [18, 15, 'flashBg'],
        [18, 15, 'transform', [PERS, 0, 0, -10, Math.random() * 80 - 40, Math.random() * 80 - 40, Math.random() * 80 - 40]],
        [20, 1, 'flashBg'],
        [20, 1, 'transform', [PERS, 0, 0, -10, Math.random() * 80 - 40, Math.random() * 80 - 40, Math.random() * 80 - 40]],
        [21, 1, 'flashBg'],
        [21, 1, 'transform', [PERS, 0, 0, -10, Math.random() * 80 - 40, Math.random() * 80 - 40, Math.random() * 80 - 40]],
        [22, 1, 'flashBg'],
        [22, 1, 'transform', [PERS, 0, 0, -10, Math.random() * 80 - 40, Math.random() * 80 - 40, Math.random() * 80 - 40]],
        [23, 1, 'flashBg'],
        [23, 1, 'transform', [PERS, 0, 0, -10, Math.random() * 80 - 40, Math.random() * 80 - 40, Math.random() * 80 - 40]],
        [23, 9, 'flashBg'],
        [23, 9, 'transform', [PERS, 0, 0, -10, Math.random() * 80 - 40, Math.random() * 80 - 40, Math.random() * 80 - 40]],
        [24, 1, 'flashBg'],
        [24, 1, 'transform', [PERS, 0, 0, -10, Math.random() * 80 - 40, Math.random() * 80 - 40, Math.random() * 80 - 40]],
        [24, 5, 'flashBg'],
        [24, 5, 'transform', [PERS, 0, 0, -10, Math.random() * 80 - 40, Math.random() * 80 - 40, Math.random() * 80 - 40]],
        [24, 9, 'flashBg'],
        [24, 9, 'transform', [PERS, 0, 0, -10, Math.random() * 80 - 40, Math.random() * 80 - 40, Math.random() * 80 - 40]],
        [24, 9, 'showMessage', '20G'],
        [24, 9, 'gravChange', 0.0001],
        [24, 14, 'tranSpeed', 0.05],

        [25, 1, 'silBoardOff'],
        [25, 1, 'transform', [PERS, 0, 0, 0, 0, 0, 0]],
        [25, 1, 'setFlashSpeed', 0.15],
        [25, 1, 'flashBg'],
        [25, 2, 'tranSpeed', 10],
        [25, 2, 'tranFunc', 'cubic-bezier(0.895, 0.030, 0.685, 0.220)'],
        [25, 3, 'transform', [PERS, 0, 0, -35, 0, 0, 0]],
        [25, 9, 'flashBg'],
        [26, 1, 'flashBg'],
        [26, 5, 'flashBg'],
        [26, 9, 'flashBg'],
        [26, 13, 'flashBg'],
        [27, 1, 'flashBg'],
        [27, 9, 'flashBg'],
        [28, 1, 'flashBg'],
        [28, 5, 'flashBg'],
        [28, 9, 'flashBg'],
        [28, 13, 'flashBg'],
        [29, 1, 'flashBg'],
        [29, 9, 'flashBg'],
        [30, 1, 'flashBg'],
        [30, 5, 'flashBg'],
        [30, 9, 'flashBg'],
        [30, 13, 'flashBg'],
        [31, 1, 'flashBg'],
        [31, 9, 'flashBg'],
        [32, 1, 'flashBg'],
        [32, 5, 'flashBg'],
        [32, 9, 'flashBg'],
        [32, 13, 'flashBg'],

        [32, 16, 'tranSpeed', 0],
        [33, 1, 'transform', [PERS, 0, 0, 0, 0, 0, 0]],
        [33, 1, 'silPieceOn'],
        [33, 1, 'showMessage', '1/60G'],
        [33, 1, 'gravChange', 1000],
        [33, 1, 'setFlashSpeed', 0.08],
        [33, 1, 'flashBg'],
        [33, 5, 'flashBg'],
        [33, 9, 'flashBg'],
        [33, 13, 'flashBg'],
        [34, 1, 'flashBg'],
        [34, 5, 'flashBg'],
        [34, 9, 'flashBg'],
        [34, 13, 'flashBg'],
        [35, 1, 'flashBg'],
        [35, 5, 'flashBg'],
        [35, 9, 'flashBg'],
        [35, 13, 'flashBg'],
        [36, 1, 'flashBg'],
        [36, 5, 'flashBg'],
        [36, 9, 'flashBg'],
        [36, 13, 'flashBg'],
        [37, 1, 'silBoardOn'],
        [37, 1, 'showMessage', '20G'],
        [37, 1, 'gravChange', 0.0001],
        [37, 1, 'setFlashSpeed', 0.04],
        [37, 1, 'flashBg'],
        [37, 3, 'flashBg'],
        [37, 5, 'flashBg'],
        [37, 7, 'flashBg'],
        [37, 9, 'flashBg'],
        [37, 11, 'flashBg'],
        [37, 13, 'flashBg'],
        [37, 15, 'flashBg'],
        [38, 1, 'flashBg'],
        [38, 3, 'flashBg'],
        [38, 5, 'flashBg'],
        [38, 7, 'flashBg'],
        [38, 9, 'flashBg'],
        [38, 11, 'flashBg'],
        [38, 13, 'flashBg'],
        [38, 15, 'flashBg'],
        [39, 1, 'flashBg'],
        [39, 3, 'flashBg'],
        [39, 5, 'flashBg'],
        [39, 7, 'flashBg'],
        [39, 9, 'flashBg'],
        [39, 11, 'flashBg'],
        [39, 13, 'flashBg'],
        [39, 15, 'flashBg'],
        [40, 1, 'flashBg'],
        [40, 3, 'flashBg'],
        [40, 5, 'flashBg'],
        [40, 7, 'flashBg'],
        [40, 9, 'flashBg'],
        [40, 11, 'flashBg'],
        [40, 13, 'flashBg'],
        [40, 13, 'tranSpeed', 3],
        [40, 13, 'tranFunc', 'cubic-bezier(0.860, 0.000, 0.070, 1.000)'],
        [40, 15, 'flashBg'],
        [41, 1, 'silBoardOff'],
        [41, 1, 'silPieceOff'],
        [41, 1, 'transform', [PERS, 0, 0, 0, 180, 0, 0]],
        [41, 1, 'showMessage', '1/60G'],
        [41, 1, 'gravChange', 1000],
        [42, 2.5, 'changeNext', 1],
        [48, 10, 'tranSpeed', 0],
        [48, 13, 'transform', [PERS, 0, 0, 0, 0, 0, 0]],
        [48, 13, 'setFlashSpeed', 2.6],
        [48, 13, 'flashBg'],
        [49, 1, 'silBoardOn'],
        [49, 1, 'showMessage', '1G'],
        [49, 1, 'gravChange', 16.6666666667],
        [49, 1, 'changeNext', 6],
        [52, 13, 'setFlashSpeed', 0.08],
        [52, 13, 'flashBg'],
        [52, 15, 'flashBg'],
        [55, 1, 'setFlashSpeed', 0.5],
        [55, 1, 'flashBg'],
        [55, 9, 'flashBg'],
        [55, 9, 'flashBg'],
        [56, 1, 'flashBg'],
        [56, 5, 'flashBg'],
        [56, 9, 'flashBg'],
        [57, 1, 'flashBg'],
        [61, 1, 'flashBg'],
        [62, 1, 'flashBg'],
        [63, 1, 'flashBg'],
        [63, 9, 'flashBg'],
        [64, 1, 'flashBg'],
        [64, 5, 'flashBg'],
        [64, 9, 'flashBg'],
        [64, 13, 'flashBg'],
        [65, 1, 'silBoardOff'],
        [65, 1, 'gravChange', 0.0001],
        [65, 1, 'showMessage', '20G'],
        [65, 1, 'tranFunc', 'cubic-bezier(0.030, 0.935, 0.050, 0.970)'],
        [65, 1, 'tranSpeed', 0.08],

        [65, 1, 'setFlashSpeed', 0.17],

        [65, 1, 'transform', [PERS, 0, 10, -20, 0, 0, 0]],
        [65, 1, 'flashBg'],
        [65, 3, 'transform', [PERS, 0, 2, -20, 0, 0, 0]],
        [65, 5, 'transform', [PERS, 0, 3, -20, 0, 0, 0]],
        [65, 6, 'transform', [PERS, 0, 2, -20, 0, 0, 0]],
        [65, 7, 'transform', [PERS, 0, 3, -20, 0, 0, 0]],
        [65, 9, 'transform', [PERS, 0, 0, -20, 0, 0, 0]],
        [65, 11, 'transform', [PERS, 0, 2, -20, 0, 0, 0]],
        [65, 13, 'transform', [PERS, 0, 3, -20, 0, 0, 0]],
        [65, 14, 'transform', [PERS, 0, 2, -20, 0, 0, 0]],
        [65, 15, 'transform', [PERS, 0, 3, -20, 0, 0, 0]],
        [65, 16, 'transform', [PERS, 0, 7, -20, 0, 0, 0]],
        [66, 1, 'transform', [PERS, 0, 5, -20, 0, 0, 0]],
        [66, 1, 'flashBg'],
        [66, 3, 'transform', [PERS, 0, -2, -20, 0, 0, 0]],
        [66, 5, 'transform', [PERS, 0, 0, -20, 0, 0, 0]],
        [66, 6, 'transform', [PERS, 0, -2, -20, 0, 0, 0]],
        [66, 7, 'transform', [PERS, 0, 0, -20, 0, 0, 0]],
        [66, 8, 'transform', [PERS, 0, -2, -20, 0, 0, 0]],
        [66, 9, 'transform', [PERS, 0, -5, -20, 0, 0, 0]],
        [66, 11, 'transform', [PERS, 0, -2, -20, 0, 0, 0]],
        [66, 13, 'transform', [PERS, 0, 0, -20, 0, 0, 0]],
        [66, 15, 'transform', [PERS, 0, -2, -20, 0, 0, 0]],

        [67, 1, 'transform', [PERS, 0, 10, -20, 0, 0, 0]],
        [67, 1, 'flashBg'],
        [67, 3, 'transform', [PERS, 0, 2, -20, 0, 0, 0]],
        [67, 5, 'transform', [PERS, 0, 3, -20, 0, 0, 0]],
        [67, 6, 'transform', [PERS, 0, 2, -20, 0, 0, 0]],
        [67, 7, 'transform', [PERS, 0, 3, -20, 0, 0, 0]],
        [67, 9, 'transform', [PERS, 0, 0, -20, 0, 0, 0]],
        [67, 11, 'transform', [PERS, 0, 2, -20, 0, 0, 0]],
        [67, 13, 'transform', [PERS, 0, 3, -20, 0, 0, 0]],
        [67, 14, 'transform', [PERS, 0, 2, -20, 0, 0, 0]],
        [67, 15, 'transform', [PERS, 0, 3, -20, 0, 0, 0]],
        [67, 16, 'transform', [PERS, 0, 7, -20, 0, 0, 0]],
        [68, 1, 'transform', [PERS, 0, 5, -20, 0, 0, 0]],
        [68, 1, 'flashBg'],
        [68, 3, 'transform', [PERS, 0, -2, -20, 0, 0, 0]],
        [68, 5, 'transform', [PERS, 0, 0, -20, 0, 0, 0]],
        [68, 5, 'flashBg'],
        [68, 6, 'transform', [PERS, 0, -2, -20, 0, 0, 0]],
        [68, 7, 'transform', [PERS, 0, 0, -20, 0, 0, 0]],
        [68, 8, 'transform', [PERS, 0, -2, -20, 0, 0, 0]],
        [68, 9, 'transform', [PERS, 0, -6, -20, 0, 0, 0]],
        [68, 9, 'flashBg'],
        [68, 11, 'transform', [PERS, 0, -2, -20, 0, 0, 0]],
        [68, 13, 'transform', [PERS, 0, 0, -20, 0, 0, 0]],
        [68, 13, 'flashBg'],
        [68, 15, 'transform', [PERS, 0, -2, -20, 0, 0, 0]],

        [69, 1, 'transform', [PERS, 0, 10, -20, 0, 0, 0]],
        [69, 1, 'flashBg'],
        [69, 3, 'transform', [PERS, 0, 2, -20, 0, 0, 0]],
        [69, 5, 'transform', [PERS, 0, 3, -20, 0, 0, 0]],
        [69, 6, 'transform', [PERS, 0, 2, -20, 0, 0, 0]],
        [69, 7, 'transform', [PERS, 0, 3, -20, 0, 0, 0]],
        [69, 9, 'transform', [PERS, 0, 0, -20, 0, 0, 0]],
        [69, 11, 'transform', [PERS, 0, 2, -20, 0, 0, 0]],
        [69, 13, 'transform', [PERS, 0, 3, -20, 0, 0, 0]],
        [69, 14, 'transform', [PERS, 0, 2, -20, 0, 0, 0]],
        [69, 15, 'transform', [PERS, 0, 3, -20, 0, 0, 0]],
        [69, 16, 'transform', [PERS, 0, 7, -20, 0, 0, 0]],
        [70, 1, 'transform', [PERS, 0, 5, -20, 0, 0, 0]],
        [70, 1, 'flashBg'],
        [70, 3, 'transform', [PERS, 0, -2, -20, 0, 0, 0]],
        [70, 5, 'transform', [PERS, 0, 0, -20, 0, 0, 0]],
        [70, 6, 'transform', [PERS, 0, -2, -20, 0, 0, 0]],
        [70, 7, 'transform', [PERS, 0, 0, -20, 0, 0, 0]],
        [70, 8, 'transform', [PERS, 0, -2, -20, 0, 0, 0]],
        [70, 9, 'transform', [PERS, 0, -5, -20, 0, 0, 0]],
        [70, 11, 'transform', [PERS, 0, -2, -20, 0, 0, 0]],
        [70, 13, 'transform', [PERS, 0, 2, -20, 0, 0, 0]],
        [70, 15, 'transform', [PERS, 0, 1, -20, 0, 0, 0]],
        [70, 15, 'transform', [PERS, 0, 1, -20, 0, 0, 0]],

        [71, 1, 'transform', [PERS, 0, 0, -20, 0, 0, 0]],
        [71, 1, 'flashBg'],
        [71, 3, 'transform', [PERS, 0, 0, -19, 0, 0, 0]],
        [71, 3, 'flashBg'],
        [71, 4, 'transform', [PERS, 0, 0, -18, 0, 0, 0]],
        [71, 4, 'flashBg'],
        [71, 7, 'transform', [PERS, 0, 0, -17, 0, 0, 0]],
        [71, 7, 'flashBg'],
        [71, 9, 'transform', [PERS, 0, 0, -12, 0, 0, 0]],
        [71, 9, 'flashBg'],
        [71, 11, 'transform', [PERS, 0, 0, -11, 0, 0, 0]],
        [71, 11, 'flashBg'],
        [71, 12, 'transform', [PERS, 0, 0, -10, 0, 0, 0]],
        [71, 12, 'flashBg'],
        [71, 15, 'transform', [PERS, 0, 0, -9, 0, 0, 0]],
        [71, 15, 'flashBg'],
        [72, 1, 'transform', [PERS, 0, 0, -4, 0, 0, 0]],
        [72, 1, 'flashBg'],
        [72, 3, 'transform', [PERS, 0, 0, -3, 0, 0, 0]],
        [72, 3, 'flashBg'],
        [72, 5, 'transform', [PERS, 0, 0, 2, 0, 0, 0]],
        [72, 5, 'flashBg'],
        [72, 7, 'transform', [PERS, 0, 0, 3, 0, 0, 0]],
        [72, 7, 'flashBg'],
        [72, 9, 'transform', [PERS, 0, 0, 8, 0, 0, 0]],
        [72, 9, 'flashBg'],

        [73, 1, 'transform', [PERS, 0, 0, 0, 0, 0, 0]],
        [73, 3, 'tranSpeed', 0],
        [73, 3, 'silOn'],
        [73, 3, 'setFlashSpeed', 0.34],

        [73, 3, 'transform', [PERS, Math.random() * 10 - 5, Math.random() * 10 - 5, -10, 0, 0, Math.random() * 10 - 5]],
        [73, 3, 'flashBg'],
        [73, 7, 'transform', [PERS, Math.random() * 10 - 5, Math.random() * 10 - 5, -10, 0, 0, Math.random() * 10 - 5]],
        [73, 7, 'flashBg'],
        [73, 11, 'transform', [PERS, Math.random() * 10 - 5, Math.random() * 10 - 5, -10, 0, 0, Math.random() * 10 - 5]],
        [73, 11, 'flashBg'],
        [73, 15, 'transform', [PERS, Math.random() * 10 - 5, Math.random() * 10 - 5, -10, 0, 0, Math.random() * 10 - 5]],
        [73, 15, 'flashBg'],

        [74, 3, 'transform', [PERS, Math.random() * 10 - 5, Math.random() * 10 - 5, -10, 0, 0, Math.random() * 10 - 5]],
        [74, 3, 'flashBg'],
        [74, 7, 'transform', [PERS, Math.random() * 10 - 5, Math.random() * 10 - 5, -10, 0, 0, Math.random() * 10 - 5]],
        [74, 7, 'flashBg'],
        [74, 11, 'transform', [PERS, Math.random() * 10 - 5, Math.random() * 10 - 5, -10, 0, 0, Math.random() * 10 - 5]],
        [74, 11, 'flashBg'],
        [74, 15, 'transform', [PERS, Math.random() * 10 - 5, Math.random() * 10 - 5, -10, 0, 0, Math.random() * 10 - 5]],
        [74, 15, 'flashBg'],

        [75, 3, 'transform', [PERS, Math.random() * 10 - 5, Math.random() * 10 - 5, -10, 0, 0, Math.random() * 10 - 5]],
        [75, 3, 'flashBg'],
        [75, 7, 'transform', [PERS, Math.random() * 10 - 5, Math.random() * 10 - 5, -10, 0, 0, Math.random() * 10 - 5]],
        [75, 7, 'flashBg'],
        [75, 11, 'transform', [PERS, Math.random() * 10 - 5, Math.random() * 10 - 5, -10, 0, 0, Math.random() * 10 - 5]],
        [75, 11, 'flashBg'],
        [75, 15, 'transform', [PERS, Math.random() * 10 - 5, Math.random() * 10 - 5, -10, 0, 0, Math.random() * 10 - 5]],
        [75, 15, 'flashBg'],

        [76, 3, 'transform', [PERS, Math.random() * 10 - 5, Math.random() * 10 - 5, -10, 0, 0, Math.random() * 10 - 5]],
        [76, 3, 'flashBg'],
        [76, 7, 'transform', [PERS, Math.random() * 10 - 5, Math.random() * 10 - 5, -10, 0, 0, Math.random() * 10 - 5]],
        [76, 7, 'flashBg'],
        [76, 11, 'transform', [PERS, Math.random() * 10 - 5, Math.random() * 10 - 5, -10, 0, 0, Math.random() * 10 - 5]],
        [76, 11, 'flashBg'],
        [76, 15, 'transform', [PERS, Math.random() * 10 - 5, Math.random() * 10 - 5, -10, 0, 0, Math.random() * 10 - 5]],
        [76, 15, 'flashBg'],

        [73, 3, 'setFlashSpeed', 0.17],

        [77, 3, 'transform', [PERS, Math.random() * 10 - 5, Math.random() * 10 - 5, -10, 0, 0, Math.random() * 10 - 5]],
        [77, 3, 'flashBg'],
        [77, 7, 'transform', [PERS, Math.random() * 10 - 5, Math.random() * 10 - 5, -10, 0, 0, Math.random() * 10 - 5]],
        [77, 7, 'flashBg'],
        [77, 11, 'transform', [PERS, Math.random() * 10 - 5, Math.random() * 10 - 5, -10, 0, 0, Math.random() * 10 - 5]],
        [77, 11, 'flashBg'],
        [77, 15, 'transform', [PERS, Math.random() * 10 - 5, Math.random() * 10 - 5, -10, 0, 0, Math.random() * 10 - 5]],
        [77, 15, 'flashBg'],

        [78, 3, 'transform', [PERS, Math.random() * 10 - 5, Math.random() * 10 - 5, -10, 0, 0, Math.random() * 10 - 5]],
        [78, 3, 'flashBg'],
        [78, 7, 'transform', [PERS, Math.random() * 10 - 5, Math.random() * 10 - 5, -10, 0, 0, Math.random() * 10 - 5]],
        [78, 7, 'flashBg'],
        [78, 11, 'transform', [PERS, Math.random() * 10 - 5, Math.random() * 10 - 5, -10, 0, 0, Math.random() * 10 - 5]],
        [78, 11, 'flashBg'],
        [78, 15, 'transform', [PERS, Math.random() * 10 - 5, Math.random() * 10 - 5, -10, 0, 0, Math.random() * 10 - 5]],
        [78, 15, 'flashBg'],

        [79, 3, 'transform', [PERS, Math.random() * 10 - 5, Math.random() * 10 - 5, -10, 0, 0, Math.random() * 10 - 5]],
        [79, 3, 'flashBg'],
        [79, 7, 'transform', [PERS, Math.random() * 10 - 5, Math.random() * 10 - 5, -10, 0, 0, Math.random() * 10 - 5]],
        [79, 7, 'flashBg'],
        [79, 11, 'transform', [PERS, Math.random() * 10 - 5, Math.random() * 10 - 5, -10, 0, 0, Math.random() * 10 - 5]],
        [79, 11, 'flashBg'],
        [79, 15, 'transform', [PERS, Math.random() * 10 - 5, Math.random() * 10 - 5, -10, 0, 0, Math.random() * 10 - 5]],
        [79, 15, 'flashBg'],

        [80, 3, 'transform', [PERS, Math.random() * 10 - 5, Math.random() * 10 - 5, -10, 0, 0, Math.random() * 10 - 5]],
        [80, 3, 'flashBg'],
        [80, 7, 'transform', [PERS, Math.random() * 10 - 5, Math.random() * 10 - 5, -10, 0, 0, Math.random() * 10 - 5]],
        [80, 7, 'flashBg'],
        [80, 11, 'transform', [PERS, Math.random() * 10 - 5, Math.random() * 10 - 5, -10, 0, 0, Math.random() * 10 - 5]],
        [80, 11, 'flashBg'],
        [80, 15, 'transform', [PERS, Math.random() * 10 - 5, Math.random() * 10 - 5, -10, 0, 0, Math.random() * 10 - 5]],
        [80, 15, 'flashBg'],

        [81, 1, 'silOff'],
        [81, 1, 'transform', [PERS, 0, 0, 0, 0, 0, 0]],
        [81, 1, 'setFlashSpeed', 0.017],
        [81, 1, 'flashBg'],
        [81, 1, 'silBoardOn'],
        [81, 5, 'flashBg'],
        [81, 5, 'silBoardOff'],
        [81, 5, 'silPieceOn'],
        [81, 9, 'flashBg'],
        [81, 9, 'silPieceOff'],
        [81, 9, 'silBoardOn'],
        [81, 13, 'flashBg'],
        [81, 13, 'silBoardOff'],
        [81, 13, 'silPieceOn'],

        [82, 1, 'flashBg'],
        [82, 1, 'silPieceOff'],
        [82, 1, 'silBoardOn'],
        [82, 5, 'flashBg'],
        [82, 5, 'silBoardOff'],
        [82, 5, 'silPieceOn'],
        [82, 9, 'flashBg'],
        [82, 9, 'silPieceOff'],
        [82, 9, 'silBoardOn'],
        [82, 13, 'flashBg'],
        [82, 13, 'silBoardOff'],
        [82, 13, 'silPieceOn'],

        [83, 1, 'flashBg'],
        [83, 1, 'silPieceOff'],
        [83, 1, 'silBoardOn'],
        [83, 5, 'flashBg'],
        [83, 5, 'silBoardOff'],
        [83, 5, 'silPieceOn'],
        [83, 9, 'flashBg'],
        [83, 9, 'silPieceOff'],
        [83, 9, 'silBoardOn'],
        [83, 13, 'flashBg'],
        [83, 13, 'silBoardOff'],
        [83, 13, 'silPieceOn'],

        [84, 1, 'flashBg'],
        [84, 1, 'silPieceOff'],
        [84, 1, 'silBoardOn'],
        [84, 5, 'flashBg'],
        [84, 5, 'silBoardOff'],
        [84, 5, 'silPieceOn'],
        [84, 9, 'flashBg'],
        [84, 9, 'silPieceOff'],
        [84, 9, 'silBoardOn'],
        [84, 13, 'flashBg'],
        [84, 13, 'silBoardOff'],
        [84, 13, 'silPieceOn'],

        [84, 13, 'tranSpeed', .33],
        [84, 13, 'tranFunc', 'cubic-bezier(0.030, 0.935, 0.050, 0.970)'],

        [85, 1, 'flashBg'],
        [85, 1, 'silPieceOff'],
        [85, 1, 'silBoardOn'],
        [85, 3, 'transform', [PERS, Math.random() * 10 - 5, Math.random() * 10 - 5, -10, 0, 0, Math.random() * 10 - 5]],
        [85, 5, 'flashBg'],
        [85, 5, 'silBoardOff'],
        [85, 5, 'silPieceOn'],
        [85, 7, 'transform', [PERS, Math.random() * 10 - 5, Math.random() * 10 - 5, -10, 0, 0, Math.random() * 10 - 5]],
        [85, 9, 'flashBg'],
        [85, 9, 'silPieceOff'],
        [85, 9, 'silBoardOn'],
        [85, 11, 'transform', [PERS, Math.random() * 10 - 5, Math.random() * 10 - 5, -10, 0, 0, Math.random() * 10 - 5]],
        [85, 13, 'flashBg'],
        [85, 13, 'silBoardOff'],
        [85, 13, 'silPieceOn'],
        [85, 15, 'transform', [PERS, Math.random() * 10 - 5, Math.random() * 10 - 5, -10, 0, 0, Math.random() * 10 - 5]],

        [86, 1, 'flashBg'],
        [86, 1, 'silPieceOff'],
        [86, 1, 'silBoardOn'],
        [86, 3, 'transform', [PERS, Math.random() * 10 - 5, Math.random() * 10 - 5, -10, 0, 0, Math.random() * 10 - 5]],
        [86, 5, 'flashBg'],
        [86, 5, 'silBoardOff'],
        [86, 5, 'silPieceOn'],
        [86, 7, 'transform', [PERS, Math.random() * 10 - 5, Math.random() * 10 - 5, -10, 0, 0, Math.random() * 10 - 5]],
        [86, 9, 'flashBg'],
        [86, 9, 'silPieceOff'],
        [86, 9, 'silBoardOn'],
        [86, 11, 'transform', [PERS, Math.random() * 10 - 5, Math.random() * 10 - 5, -10, 0, 0, Math.random() * 10 - 5]],
        [86, 13, 'flashBg'],
        [86, 13, 'silBoardOff'],
        [86, 13, 'silPieceOn'],
        [86, 15, 'transform', [PERS, Math.random() * 10 - 5, Math.random() * 10 - 5, -10, 0, 0, Math.random() * 10 - 5]],

        [87, 1, 'flashBg'],
        [87, 1, 'silPieceOff'],
        [87, 1, 'silBoardOn'],
        [87, 3, 'transform', [PERS, Math.random() * 10 - 5, Math.random() * 10 - 5, -10, 0, 0, Math.random() * 10 - 5]],
        [87, 5, 'flashBg'],
        [87, 5, 'silBoardOff'],
        [87, 5, 'silPieceOn'],
        [87, 7, 'transform', [PERS, Math.random() * 10 - 5, Math.random() * 10 - 5, -10, 0, 0, Math.random() * 10 - 5]],
        [87, 9, 'flashBg'],
        [87, 9, 'silPieceOff'],
        [87, 9, 'silBoardOn'],
        [87, 11, 'transform', [PERS, Math.random() * 10 - 5, Math.random() * 10 - 5, -10, 0, 0, Math.random() * 10 - 5]],
        [87, 13, 'flashBg'],
        [87, 13, 'silBoardOff'],
        [87, 13, 'silPieceOn'],
        [87, 15, 'transform', [PERS, Math.random() * 10 - 5, Math.random() * 10 - 5, -10, 0, 0, Math.random() * 10 - 5]],

        [88, 1, 'flashBg'],
        [88, 1, 'silPieceOff'],
        [88, 1, 'silBoardOn'],
        [88, 3, 'transform', [PERS, Math.random() * 10 - 5, Math.random() * 10 - 5, -10, 0, 0, Math.random() * 10 - 5]],
        [88, 5, 'flashBg'],
        [88, 5, 'silBoardOff'],
        [88, 5, 'silPieceOn'],
        [88, 7, 'transform', [PERS, Math.random() * 10 - 5, Math.random() * 10 - 5, -10, 0, 0, Math.random() * 10 - 5]],
        [88, 9, 'flashBg'],
        [88, 9, 'silPieceOff'],
        [88, 9, 'silBoardOn'],
        [88, 11, 'transform', [PERS, Math.random() * 10 - 5, Math.random() * 10 - 5, -10, 0, 0, Math.random() * 10 - 5]],
        [88, 13, 'flashBg'],
        [88, 13, 'silBoardOff'],
        [88, 13, 'silPieceOn'],
        [88, 15, 'transform', [PERS, Math.random() * 10 - 5, Math.random() * 10 - 5, -10, 0, 0, Math.random() * 10 - 5]],

        [89, 1, 'silOn'],
        [89, 1, 'setFlashSpeed', 0.03],
        [89, 1, 'flashBg'],
        [89, 1, 'tranSpeed', 0],
        [89, 1, 'silPieceOff'],
        [89, 1, 'transform', [PERS, 0, 0, -25, 10, -10, -30]],
        [89, 2, 'tranSpeed', 10],
        [89, 2, 'tranFunc', 'linear'],
        [89, 3, 'transform', [PERS, 0, 0, 0, 0, 0, 0]],
        [89, 3, 'flashBg'],
        [89, 5, 'flashBg'],
        [89, 6, 'flashBg'],
        [89, 7, 'flashBg'],
        [89, 9, 'flashBg'],
        [89, 11, 'flashBg'],
        [89, 13, 'flashBg'],
        [89, 14, 'flashBg'],
        [89, 15, 'flashBg'],
        [89, 16, 'flashBg'],

        [90, 1, 'flashBg'],
        [90, 3, 'flashBg'],
        [90, 5, 'flashBg'],
        [90, 6, 'flashBg'],
        [90, 7, 'flashBg'],
        [90, 8, 'flashBg'],
        [90, 9, 'flashBg'],
        [90, 11, 'flashBg'],
        [90, 13, 'flashBg'],
        [90, 15, 'flashBg'],

        [91, 1, 'flashBg'],
        [91, 3, 'flashBg'],
        [91, 5, 'flashBg'],
        [91, 6, 'flashBg'],
        [91, 7, 'flashBg'],
        [91, 9, 'flashBg'],
        [91, 11, 'flashBg'],
        [91, 13, 'flashBg'],
        [91, 14, 'flashBg'],
        [91, 15, 'flashBg'],
        [91, 16, 'flashBg'],

        [92, 1, 'flashBg'],
        [92, 3, 'flashBg'],
        [92, 5, 'flashBg'],
        [92, 6, 'flashBg'],
        [92, 7, 'flashBg'],
        [92, 8, 'flashBg'],
        [92, 9, 'flashBg'],
        [92, 11, 'flashBg'],
        [92, 13, 'flashBg'],
        [92, 15, 'flashBg'],

        [93, 1, 'flashBg'],
        [93, 7, 'flashBg'],
        [93, 8, 'flashBg'],
        [93, 9, 'flashBg'],
        [93, 11, 'flashBg'],
        [93, 13, 'flashBg'],
        [93, 15, 'flashBg'],

        [94, 3, 'flashBg'],
        [94, 5, 'flashBg'],
        [94, 7, 'flashBg'],
        [94, 9, 'flashBg'],
        [94, 11, 'flashBg'],
        [94, 12, 'flashBg'],
        [94, 13, 'flashBg'],
        [94, 15, 'flashBg'],

        [95, 1, 'flashBg'],
        [95, 3, 'flashBg'],
        [95, 4, 'flashBg'],
        [95, 5, 'flashBg'],
        [95, 6, 'flashBg'],
        [95, 7, 'flashBg'],
        [95, 9, 'flashBg'],
        [95, 11, 'flashBg'],
        [95, 13, 'flashBg'],
        [95, 15, 'flashBg'],

        [96, 1, 'flashBg'],

        [97, 1, 'silOff'],
        [97, 1, 'showMessage', '1/60G'],
        [97, 1, 'gravChange', 1000],
        [97, 1, 'tranSpeed', 12],
        [97, 1, 'tranFunc', 'ease-in'],
        [97, 1, 'transform', [PERS, 0, 0, -150, 0, 0, 0]],
        [Number.MAX_SAFE_INTEGER, 'none']
      ]
      $('#zen_panel').style.display = "none"
      game.updateStats()
    },
  },
  sprint: {
    update: (arg) => {
      const game = gameHandler.game
      if (game.pps >= 2 && game.settings.hasPaceBgm) {
        if (!game.startedOnPaceEvent) {
          game.onPaceTime = game.timePassed
          game.startedOnPaceEvent = true
        }
        if (game.timePassed - game.onPaceTime >= 3000) {
          if (!sound.paceBgmIsRaised) {
            sound.add('onpace')
          }
          sound.raisePaceBgm()
          $('#timer').classList.add('pace')
        }
      } else {
        if (sound.paceBgmIsRaised) {
          sound.add('offpace')
        }
        game.startedOnPaceEvent = false
        sound.lowerPaceBgm()
        $('#timer').classList.remove('pace')
      }
      collapse(arg)
      if (arg.piece.inAre) {
        initialDas(arg)
        initialRotation(arg)
        initialHold(arg)
        arg.piece.are += arg.ms
      } else {
        respawnPiece(arg)
        rotate(arg)
        rotate180(arg)
        shifting(arg)
      }
      gravity(arg)
      softDrop(arg, 70)
      hardDrop(arg)
      extendedLockdown(arg)
      if (!arg.piece.inAre) {
        hold(arg)
      }
      lockFlash(arg)
      updateLasts(arg)
    },
    onPieceSpawn: (game) => {
    },
    onInit: (game) => {
      game.lineGoal = settings.game.sprint.lineGoal
      game.isRaceMode = true
      game.stat.level = 1
      game.appends.line = `<span class="small">/${settings.game.sprint.lineGoal}</span>`
      game.piece.gravity = 1000
      if (settings.game.sprint.regulationMode) {
        game.piece.areLimit = 0
        game.piece.areLineLimit = 0
        game.piece.areLimitLineModifier = 0
        $('#levelType').innerHTML = "Sprint (" + settings.game.sprint.lineGoal + "L, REG)"
      }
      else $('#levelType').innerHTML = "Sprint (" + settings.game.sprint.lineGoal + "L)"
      $('#zen_panel').style.display = "none"
      updateFallSpeed(game)
      game.updateStats()
    },
  },
  ultra: {
    update: (arg) => {
      const game = gameHandler.game
      if (game.timePassed + (game.rtaLimit ? game.timePassedAre : 0) >= game.timeGoal - 30000) {
        if (!game.playedHurryUp) {
          sound.add('hurryup')
          $(`#timer${game.rtaLimit ? '-real' : ''}`).classList.add('hurry-up')
          game.playedHurryUp = true
        }
        sound.raisePaceBgm()
      } else {
        game.playedHurryUp = false
      }
      collapse(arg)
      if (arg.piece.inAre) {
        initialDas(arg)
        initialRotation(arg)
        initialHold(arg)
        arg.piece.are += arg.ms
      } else {
        respawnPiece(arg)
        rotate(arg)
        rotate180(arg)
        shifting(arg)
      }
      gravity(arg)
      softDrop(arg, 70)
      hardDrop(arg)
      extendedLockdown(arg)
      if (!arg.piece.inAre) {
        hold(arg)
      }
      lockFlash(arg)
      updateLasts(arg)
    },
    onPieceSpawn: (game) => {
    },
    onInit: (game) => {
      game.timeGoal = settings.game.ultra.timeLimit
      game.rtaLimit = settings.game.ultra.useRta
      if (settings.game.ultra.useRta) {
        if (settings.game.ultra.timeLimit == 120000) $('#levelType').innerHTML = "Ultra (2:00 RTA)"
        else $('#levelType').innerHTML = "Ultra (3:00 RTA)"
      }
      else {
        if (settings.game.ultra.timeLimit == 120000) $('#levelType').innerHTML = "Ultra (2:00 IGT)"
        else $('#levelType').innerHTML = "Ultra (3:00 IGT)"
      }
      game.isRaceMode = true
      game.piece.gravity = 1000
      $('#zen_panel').style.display = "none"
      updateFallSpeed(game)
      game.stat.level = 1
      game.updateStats()
    },
  },
  combo: {
    update: (arg) => {
      const game = gameHandler.game
      if (game.timePassed >= game.timeGoal - 10000) {
        if (!game.playedHurryUp) {
          sound.add('hurryup')
          $('#timer').classList.add('hurry-up')
          game.playedHurryUp = true
        }
        sound.raisePaceBgm()
      } else {
        game.playedHurryUp = false
      }
      collapse(arg)
      if (arg.piece.inAre) {
        initialDas(arg)
        initialRotation(arg)
        initialHold(arg)
        arg.piece.are += arg.ms
      } else {
        respawnPiece(arg)
        rotate(arg)
        rotate180(arg)
        shifting(arg)
      }
      gravity(arg)
      softDrop(arg, 70)
      hardDrop(arg)
      extendedLockdown(arg)
      if (!arg.piece.inAre) {
        hold(arg)
      }
      lockFlash(arg)
      updateLasts(arg)
    },
    onPieceSpawn: (game) => {
    },
    onInit: (game) => {
      if (settings.game.combo.holdType === 'skip') {
        $('#levelType').innerHTML = "Combo Challenge (Skip)"
        game.hold.useSkip = true
        game.hold.holdAmount = 2
        game.hold.holdAmountLimit = 2
        game.hold.gainHoldOnPlacement = true
        game.resize()
      }
      else $('#levelType').innerHTML = "Combo Challenge (Hold)"
      if (!(input.holdingShift)) {game.timeGoal = 30000}
      else {
        $('#next-label').style.animationName = "hurry-up-timer"
        $('#next-label').style.animationDuration = "0.4s"
        $('#next-label').style.animationIterationCount = "infinite"
        $('#next-label').style.animationDirection = "alternate"
        $('#next-label').style.animationTimingFunction = "ease-in-out"
        $('#next-label').style.fontSize = "1.3em"
      }
      game.isRaceMode = true
      game.piece.gravity = 1000
      $('#zen_panel').style.display = "none"
      updateFallSpeed(game)
      game.stat.level = 1
      game.updateStats()
      window.gridtemp = Math.floor(Math.random() * 9)
      if (window.gridtemp == 0) window.gridtemp = 'red'
      else if (window.gridtemp == 1) window.gridtemp = 'orange'
      else if (window.gridtemp == 2) window.gridtemp = 'yellow'
      else if (window.gridtemp == 3) window.gridtemp = 'green'
      else if (window.gridtemp == 4) window.gridtemp = 'lightBlue'
      else if (window.gridtemp == 5) window.gridtemp = 'blue'
      else if (window.gridtemp == 6) window.gridtemp = 'purple'
      else if (window.gridtemp == 7) window.gridtemp = 'white'
      else if (window.gridtemp == 8) window.gridtemp = 'black'
      game.stack.grid[0][game.stack.height + game.stack.hiddenHeight - 1] = gridtemp
      window.gridtemp = Math.floor(Math.random() * 9)
      if (window.gridtemp == 0) window.gridtemp = 'red'
      else if (window.gridtemp == 1) window.gridtemp = 'orange'
      else if (window.gridtemp == 2) window.gridtemp = 'yellow'
      else if (window.gridtemp == 3) window.gridtemp = 'green'
      else if (window.gridtemp == 4) window.gridtemp = 'lightBlue'
      else if (window.gridtemp == 5) window.gridtemp = 'blue'
      else if (window.gridtemp == 6) window.gridtemp = 'purple'
      else if (window.gridtemp == 7) window.gridtemp = 'white'
      else if (window.gridtemp == 8) window.gridtemp = 'black'
      game.stack.grid[0][game.stack.height + game.stack.hiddenHeight - 2] = gridtemp
      window.gridtemp = Math.floor(Math.random() * 9)
      if (window.gridtemp == 0) window.gridtemp = 'red'
      else if (window.gridtemp == 1) window.gridtemp = 'orange'
      else if (window.gridtemp == 2) window.gridtemp = 'yellow'
      else if (window.gridtemp == 3) window.gridtemp = 'green'
      else if (window.gridtemp == 4) window.gridtemp = 'lightBlue'
      else if (window.gridtemp == 5) window.gridtemp = 'blue'
      else if (window.gridtemp == 6) window.gridtemp = 'purple'
      else if (window.gridtemp == 7) window.gridtemp = 'white'
      else if (window.gridtemp == 8) window.gridtemp = 'black'
      if (game.next.queue[0] === 'J') {
        game.stack.grid[1][game.stack.height + game.stack.hiddenHeight - 1] = gridtemp
      } else {
        game.stack.grid[1][game.stack.height + game.stack.hiddenHeight - 2] = gridtemp
      }
    },
  },
  standardx: {
    update: (arg) => {
      collapse(arg)
      if (arg.piece.inAre) {
        initialDas(arg)
        initialRotation(arg)
        initialHold(arg)
        arg.piece.are += arg.ms
      } else {
        respawnPiece(arg)
        rotate(arg)
        rotate180(arg)
        shifting(arg)
      }
      gravity(arg)
      hyperSoftDrop(arg)
      hardDrop(arg)
      classicLockdown(arg)
      if (!arg.piece.inAre) {
        hold(arg)
      }
      lockFlash(arg)
      updateLasts(arg)
    },
    onPieceSpawn: (game) => {
      game.stat.level = Math.floor(game.stat.line / 10 + 1)
      const x = game.stat.level
      const gravityEquation = (0.9 - ((x - 1) * 0.001)) ** (x - 1)
      game.piece.gravity = Math.max(gravityEquation * 1000, framesToMs(1 / 20))
      if (game.stat.level >= 40) {
        game.piece.lockDelayLimit = ~~framesToMs((30 * Math.pow(0.93, (Math.pow(game.stat.level - 40, 0.8)))))
      } else {
        game.piece.lockDelayLimit = 500
      }
      updateFallSpeed(game)
      levelUpdate(game)
    },
    onInit: (game) => {
      $('#levelType').innerHTML = "Standard (1S)"
      game.stat.level = 1
      lastLevel = 1
      game.piece.gravity = 1000
      $('#zen_panel').style.display = "none"
      updateFallSpeed(game)
      game.updateStats()
    },
  },
  survival: {
    update: (arg) => {
      const game = gameHandler.game

      collapse(arg)
      if (arg.piece.inAre) {
        initialDas(arg)
        initialRotation(arg)
        initialHold(arg)
        arg.piece.are += arg.ms
      } else {
        respawnPiece(arg)
        rotate(arg)
        rotate180(arg)
        shifting(arg)
      }
      if (
        arg.piece.startingAre >= arg.piece.startingAreLimit &&
        game.marginTime >= game.marginTimeLimit
      ) {
        garbageTimer += arg.ms
        if (garbageTimer > 16.667) {
          garbageTimer -= 16.667
          const randomCheck = Math.floor(Math.random() * 100000) / 100
          if (randomCheck < game.garbageRate) {
            arg.stack.addGarbageToCounter(1)
          }
        }
      }
      gravity(arg)
      softDrop(arg, 70)
      hardDrop(arg)
      extendedLockdown(arg)
      if (!arg.piece.inAre) {
        hold(arg)
      }
      lockFlash(arg)
      updateLasts(arg)
      game.stat.level = Math.max(
        settings.game.survival.startingLevel,
        Math.floor(game.timePassed / 10000 + 1)
      )
      const x = game.stat.level
      const gravityEquation = (0.99 - (x - 1) * 0.007) ** (x - 1)
      game.piece.gravity = Math.max(gravityEquation * 1000, framesToMs(1 / 20))
      game.garbageRate =
        x ** game.garbageRateExponent * game.garbageRateMultiplier +
        game.garbageRateAdditive
      $('#zen_panel').style.display = "none"
      if (levelUpdate(game)) {
        game.updateStats()
      }
      if (
        arg.piece.startingAre >= arg.piece.startingAreLimit &&
        game.marginTime < game.marginTimeLimit
      ) {
        game.marginTime += arg.ms
      }
    },
    onPieceSpawn: (game) => {},
    onInit: (game) => {
      if (settings.game.survival.matrixWidth === 'standard') {
        if (settings.game.survival.difficulty == 0) $('#levelType').innerHTML = "Survival (Standard, Beginner, " + settings.game.survival.startingLevel + "S)"
        else if (settings.game.survival.difficulty == 1) $('#levelType').innerHTML = "Survival (Standard, Very Easy, " + settings.game.survival.startingLevel + "S)"
        else if (settings.game.survival.difficulty == 2) $('#levelType').innerHTML = "Survival (Standard, Easy, " + settings.game.survival.startingLevel + "S)"
        else if (settings.game.survival.difficulty == 3) $('#levelType').innerHTML = "Survival (Standard, Intermediate, " + settings.game.survival.startingLevel + "S)"
        else if (settings.game.survival.difficulty == 4) $('#levelType').innerHTML = "Survival (Standard, Hard, " + settings.game.survival.startingLevel + "S)"
        else if (settings.game.survival.difficulty == 5) $('#levelType').innerHTML = "Survival (Standard, Expert, " + settings.game.survival.startingLevel + "S)"
        else $('#levelType').innerHTML = "Survival (Standard, Pro, " + settings.game.survival.startingLevel + "S)"
        game.settings.width = 10
        game.stack.width = 10
        game.stack.new()
        game.piece.xSpawnOffset = 0
        game.resize()
      }
      else {
        if (settings.game.survival.difficulty == 0) $('#levelType').innerHTML = "Survival (Narrow, Beginner, " + settings.game.survival.startingLevel + "S)"
        else if (settings.game.survival.difficulty == 1) $('#levelType').innerHTML = "Survival (Narrow, Very Easy, " + settings.game.survival.startingLevel + "S)"
        else if (settings.game.survival.difficulty == 2) $('#levelType').innerHTML = "Survival (Narrow, Easy, " + settings.game.survival.startingLevel + "S)"
        else if (settings.game.survival.difficulty == 3) $('#levelType').innerHTML = "Survival (Narrow, Intermediate, " + settings.game.survival.startingLevel + "S)"
        else if (settings.game.survival.difficulty == 4) $('#levelType').innerHTML = "Survival (Narrow, Hard, " + settings.game.survival.startingLevel + "S)"
        else if (settings.game.survival.difficulty == 5) $('#levelType').innerHTML = "Survival (Narrow, Expert, " + settings.game.survival.startingLevel + "S)"
        else $('#levelType').innerHTML = "Survival (Narrow, Pro, " + settings.game.survival.startingLevel + "S)"
      }
      const difficulty = settings.game.survival.difficulty
      game.garbageRateExponent = [1.91, 1.95, 1.97, 2, 2.03, 2.07, 2.1][difficulty]
      game.garbageRateMultiplier = [0.005, 0.01, 0.02, 0.03, 0.05, 0.08, 0.1][difficulty]
      game.garbageRateAdditive = [1, 1.5, 2, 2.5, 9, 18, 35][difficulty]
      game.stack.garbageSwitchRate = [1, 1, 8, 4, 2, 1, 1][difficulty]
      game.stack.antiGarbageBuffer = [-20, -10, -8, -6, -4, -2, 0][difficulty]
      if (difficulty <= 1) game.stack.copyBottomForGarbage = true
      game.garbageRate = 0
      game.marginTime = 0
      game.marginTimeLimit = 5000
      garbageTimer = 0
      game.stat.level = settings.game.survival.startingLevel
      lastLevel = parseInt(settings.game.survival.startingLevel)
      game.piece.gravity = 1000
      $('#zen_panel').style.display = "none"
      updateFallSpeed(game)
      game.updateStats()
    },
  },
  master: {
    update: (arg) => {
      collapse(arg)
      if (arg.piece.inAre) {
        initialDas(arg)
        initialRotation(arg)
        initialHold(arg)
        arg.piece.are += arg.ms
      } else {
        respawnPiece(arg)
        rotate(arg)
        rotate180(arg)
        shifting(arg)
      }
      gravity(arg)
      softDrop(arg)
      hardDrop(arg)
      switch (settings.game.master.lockdownMode) {
        case 'infinity':
          infiniteLockdown(arg)
          break
        case 'extended':
          extendedLockdown(arg)
          break
        case 'classic':
          classicLockdown(arg)
          break
      }
      if (!arg.piece.inAre) {
        hold(arg)
      }
      lockFlash(arg)
      updateLasts(arg)
    },
    onPieceSpawn: (game) => {
      game.stat.level = Math.max(Math.floor(game.stat.line / 10 + 1), settings.game.master.startingLevel)
      const calcLevel = Math.min(29, game.stat.level - 1)
      switch (settings.game.master.lockDelayMode) {
        case "Master":
          var DELAY_TABLE = [500, 480, 461, 442, 425, 408, 391, 376, 361, 346, 332, 319, 306, 294, 282, 271, 260, 250, 240, 230, 221, 212, 204, 196, 188, 180, 173, 166, 159, 153]
          var ARE_TABLE = [400, 376, 353, 332, 312, 294, 276, 259, 244, 229, 215, 203, 190, 179, 168, 158, 149, 140, 131, 123, 116, 109, 103, 96, 91, 85, 80, 75, 71, 65]
          break
        case "Master+":
          var DELAY_TABLE = [483, 466, 450, 433, 416, 400, 383, 366, 350, 333, 316, 300, 283, 266, 250, 233, 216, 200, 183, 166, 150, 133, 116, 100, 83.3, 66.7, 50, 33.3, 16.7, 1]
          var ARE_TABLE = [400, 376, 353, 332, 312, 294, 276, 259, 244, 229, 215, 203, 190, 179, 168, 158, 149, 140, 131, 123, 116, 109, 103, 96, 91, 85, 80, 75, 71, 65]
          break
        case "Connected":
          var DELAY_TABLE = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 167, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 95]
          var ARE_TABLE = [400, 376, 353, 332, 312, 294, 276, 259, 244, 229, 215, 203, 190, 179, 168, 158, 149, 140, 131, 123, 116, 109, 103, 96, 91, 85, 80, 75, 71, 65]
          break
      }
      game.piece.lockDelayLimit = DELAY_TABLE[calcLevel]
      game.piece.areLimit = ARE_TABLE[calcLevel]
      game.piece.areLineLimit = ARE_TABLE[calcLevel]
      game.stat.entrydelay = `${ARE_TABLE[calcLevel]}ms`
      game.hold.isDisabled = !settings.game.master.hold
      levelUpdate(game)
    },
    onInit: (game) => {
      if (settings.game.master.lockdownMode == 'infinity') {
        if (settings.game.master.lockDelayMode == "Connected") $('#levelType').innerHTML = "Master Connected (Forgiving, " + settings.game.master.startingLevel + "S)"
        else $('#levelType').innerHTML = settings.game.master.lockDelayMode + " (Forgiving, " + settings.game.master.startingLevel + "S)"
      }
      else if (settings.game.master.lockdownMode == 'extended') {
        if (settings.game.master.lockDelayMode == "Connected") $('#levelType').innerHTML = "Master Connected (Limited, " + settings.game.master.startingLevel + "S)"
        else $('#levelType').innerHTML = settings.game.master.lockDelayMode + " (Limited, " + settings.game.master.startingLevel + "S)"
      }
      else {
        if (settings.game.master.lockDelayMode == "Connected") $('#levelType').innerHTML = "Master Connected (Strict, " + settings.game.master.startingLevel + "S)"
        else $('#levelType').innerHTML = settings.game.master.lockDelayMode + " (Strict, " + settings.game.master.startingLevel + "S)"
      }
      if (settings.game.master.startingLevel < 10) {
        sound.playMenuSe('hardstart1')
      } else if (settings.game.master.startingLevel < 20) {
        sound.playMenuSe('hardstart2')
      } else if (settings.game.master.startingLevel < 25) {
        sound.playMenuSe('hardstart3')
      } else {
        sound.playMenuSe('hardstart4')
      }
      game.lineGoal = 300
      game.stat.level = settings.game.master.startingLevel
      lastLevel = parseInt(settings.game.master.startingLevel)
      game.prefixes.level = 'M'
      game.stat.entrydelay = '400ms'
      game.piece.gravity = framesToMs(1 / 20)
      $('#zen_panel').style.display = "none"
      updateFallSpeed(game)
      game.updateStats()
    },
  },
  prox: {
    update: (arg) => {
      collapse(arg)
      if (arg.piece.inAre) {
        initialDas(arg)
        initialRotation(arg)
        initialHold(arg)
        arg.piece.are += arg.ms
      } else {
        respawnPiece(arg)
        rotate(arg)
        rotate180(arg)
        shifting(arg)
      }
      gravity(arg)
      hyperSoftDrop(arg)
      hardDrop(arg)
      classicLockdown(arg)
      if (!arg.piece.inAre) {
        hold(arg)
      }
      lockFlash(arg)
      updateLasts(arg)
    },
    onPieceSpawn: (game) => {
      game.stat.level = Math.min(10, Math.max(settings.game.prox.startingLevel, Math.floor(game.stat.line / 20 + 1)))
      const calcLevel = game.stat.level - 1
      const SPEED_TABLE = [
        1, 1 / 2, 1 / 5, 1 / 20, 1 / 20,
        1 / 20, 1 / 20, 1 / 20, 1 / 20, 1 / 20]
      game.piece.gravity = framesToMs(SPEED_TABLE[calcLevel])
      const DELAY_TABLE = [
        500, 475, 450, 375, 350,
        325, 300, 275, 250, 225]
      game.piece.lockDelayLimit = DELAY_TABLE[calcLevel]
      const NEXT_TABLE = [
        6, 5, 4, 3, 2,
        1, 1, 1, 1, 1]
      game.next.nextLimit = NEXT_TABLE[calcLevel]
      if (calcLevel >= 3 && !shown20GMessage) {
        $('#message').textContent = '20G'
        resetAnimation('#message', 'dissolve')
        shown20GMessage = true
      }
      if (calcLevel >= 8 && !game.hold.isDisabled) {
        if (game.stat.piece > 0) {
          sound.killBgm()
          sound.playBgm(game.settings.music[1], game.type)
        }
        game.useAltMusic = true
        game.hold.isDisabled = true
        game.hold.isDirty = true
      }
      // if (game.stat.level > 1 && !shownHoldWarning) {
      //   $('#hold-disappear-message').textContent = locale.getString('ui', 'watchOutWarning')
      // }
      levelUpdate(game)
    },
    onInit: (game) => {
      $('#levelType').innerHTML = "Pro (" + settings.game.prox.startingLevel + "S)"
      sound.playMenuSe('hardstart3')
      shown20GMessage = (settings.game.prox.startingLevel > 3) ? true : false
      shownHoldWarning = false
      game.lineGoal = 200
      game.stat.level = settings.game.prox.startingLevel
      lastLevel = parseInt(settings.game.prox.startingLevel)
      game.prefixes.level = 'MACH '
      game.smallStats.level = true
      game.resize()
      $('#zen_panel').style.display = "none"
      updateFallSpeed(game)
      game.updateStats()
    },
  },
  deluxe: {
    update: (arg) => {
      collapse(arg)
      if (arg.piece.inAre) {
        handheldDasAre(arg, framesToMs(9), framesToMs(3))
        arg.piece.are += arg.ms
      } else {
        respawnPiece(arg)
        rotate(arg)
        shiftingRetro(arg, framesToMs(9), framesToMs(3))
      }
      deluxeGravity(arg)
      softDropRetro(arg, framesToMs(2))
      classicLockdown(arg)
      lockFlash(arg)
      updateLasts(arg)
    },
    onPieceSpawn: (game) => {
      // game.stat.level = Math.floor(game.stat.line / 10)
      game.stat.level = Math.max(settings.game.deluxe.startingLevel, Math.floor(game.stat.line / 10))
      const SPEED_TABLE = [53, 49, 45, 41, 37, 33, 28, 22, 17, 11, 10, 9, 8, 7, 6, 6, 5, 5, 4, 4, 3]
      let levelAdd = 0
      if (game.appends.level === '♥') {
        levelAdd = 10
      }
      game.piece.gravity = framesToMs(SPEED_TABLE[Math.min(20, game.stat.level + levelAdd)])
      levelUpdate(game)
    },
    onInit: (game) => {
      // game.stat.level = 0
      // game.appends.level = '♥'
      // lastLevel = 0
      $('#levelType').innerHTML = "Deluxe (" + settings.game.deluxe.startingLevel + "S)"
      game.stat.level = settings.game.deluxe.startingLevel
      lastLevel = parseInt(settings.game.deluxe.startingLevel)
      if (settings.settings.skin !== 'auto') {
        game.makeSprite()
        game.piece.useSpecialI = false
      } else {
        game.makeSprite(
            [
              'i1', 'i2', 'i3', 'i4', 'i5', 'i6',
              'l', 'o',
              'z', 't', 'j',
              's', 'white', 'black',
            ],
            ['mino', 'stack'],
            'deluxe-special',
        )
        game.colors = PIECE_COLORS.handheldSpecial
      }
    },
  },
  handheld: {
    update: (arg) => {
      collapse(arg)
      if (arg.piece.inAre) {
        handheldDasAre(arg, framesToMs(23), 150)
        arg.piece.are += arg.ms
      } else {
        respawnPiece(arg)
        rotate(arg)
        shiftingRetro(arg, framesToMs(23), 150)
      }
      classicGravity(arg)
      softDropRetro(arg, 50)
      retroLockdown(arg)
      lockFlash(arg)
      updateLasts(arg)
    },
    onPieceSpawn: (game) => {
      game.stat.level = Math.max(settings.game.handheld.startingLevel, Math.floor(game.stat.line / 10))
      const SPEED_TABLE = [53, 49, 45, 41, 37, 33, 28, 22, 17, 11, 10, 9, 8, 7, 6, 6, 5, 5, 4, 4, 3]
      let levelAdd = 0
      if (game.appends.level === '♥') {
        levelAdd = 10
      }
      game.piece.gravity = framesToMs(SPEED_TABLE[Math.min(20, game.stat.level + levelAdd)])
      levelUpdate(game)
    },
    onInit: (game) => {
      $('#levelType').innerHTML = "Handheld (" + settings.game.handheld.startingLevel + "S)"
      game.stat.level = settings.game.handheld.startingLevel
      lastLevel = parseInt(settings.game.handheld.startingLevel)
      if (input.holdingShift) {
        sound.add('levelup')
        game.appends.level = '♥'
      }
      if (settings.settings.skin !== 'auto') {
        game.makeSprite()
        game.piece.useSpecialI = false
      } else {
        game.makeSprite(
            [
              'i1', 'i2', 'i3', 'i4', 'i5', 'i6',
              'l', 'o',
              'z', 't', 'j',
              's', 'white', 'black',
            ],
            ['mino'],
            'handheld-special',
        )
        game.colors = PIECE_COLORS.handheldSpecial
        game.updateStats()
      }
      $('#zen_panel').style.display = "none"
    },
  },
  retro: {
    update: (arg) => {
      collapse(arg)
      if (arg.stack.levelUpAnimation < arg.stack.levelUpAnimationLimit) {
        arg.stack.makeAllDirty()
        arg.stack.isDirty = true
        arg.stack.levelUpAnimation += arg.ms
      }
      if (settings.game.retro.mechanics === 'accurate') {
        if (arg.piece.inAre) {
          nesDasAre(arg)
          arg.piece.are += arg.ms
        } else {
          respawnPiece(arg)
          shiftingNes(arg)
          rotate(arg)
          classicGravity(arg)
          softDropNes(arg)
          retroLockdown(arg, true)
        }
      } else {
        if (arg.piece.inAre) {
          initialDas(arg)
          initialRotation(arg)
          arg.piece.are += arg.ms
        } else {
          respawnPiece(arg)
          rotate(arg)
          rotate180(arg)
          shifting(arg)
        }
        classicGravity(arg)
        softDropNes(arg, false)
        hardDrop(arg)
        retroLockdown(arg, true)
      }
      if (!arg.piece.inAre) {
        arg.piece.holdingTime += arg.ms
      }
      lockFlash(arg)
      updateLasts(arg)
    },
    onPieceSpawn: (game) => {
      var startLevel = settings.game.retro.startingLevel
      if (settings.game.retro.startingLevel > 19 && settings.game.retro.startingLevel < 29) {startLevel = 19}
      const startingLines = Math.min((Math.max(100, startLevel * 10 - 50)), (startLevel * 10 + 10))
      game.stat.level = Math.floor(Math.max(((game.stat.line + 10 - startingLines + (startLevel * 10)) / 10), startLevel))
      const SPEED_TABLE = [
        48, 43, 38, 33, 28,
        23, 18, 13, 8, 5,
        5, 5, 5, 4, 4,
        4, 3, 3, 3, 2,
        2, 2, 2, 2, 2,
        2, 2, 2, 2, 1,
        1, 1, 1, 1, 1,
        1, 1, 1, 1, 0.5,
      ]
      if (settings.game.retro.compMode == false) {game.piece.gravity = framesToMs(SPEED_TABLE[Math.min(29, game.stat.level)])}
      else {game.piece.gravity = framesToMs(SPEED_TABLE[Math.min(39, game.stat.level)])}
      if (game.next.queue[0] === 'I') {
        lastSeenI = 0
      } else {
        lastSeenI++
      }
      levelUpdate(game)
    },
    onInit: (game) => {
      if (settings.game.retro.mechanics === 'accurate') {
        game.hideGrid = true
        game.stack.updateGrid()
        if (settings.game.retro.compMode == false) $('#levelType').innerHTML = "Console (Accurate, " + settings.game.retro.startingLevel + "S)"
        else $('#levelType').innerHTML = "Console (Accurate, " + settings.game.retro.startingLevel + "S)*"
      }
      else {
        if (settings.game.retro.compMode == false) $('#levelType').innerHTML = "Console (Modern, " + settings.game.retro.startingLevel + "S)"
        else $('#levelType').innerHTML = "Console (Modern, " + settings.game.retro.startingLevel + "S)*"
      }
      lastSeenI = 0
      game.piece.holdingTimeLimit = 1600
      game.redrawOnLevelUp = true
      game.stat.level = settings.game.retro.startingLevel
      lastLevel = parseInt(settings.game.retro.startingLevel)
      if (settings.game.retro.startingLevel > 19 && settings.game.retro.startingLevel < 29) {
        game.stat.level = 19
        lastLevel = parseInt(19)
      }
      if (settings.settings.skin !== 'auto') {
        game.makeSprite()
      } else {
        game.makeSprite(
            [
              'x-0', 'l-0', 'r-0',
              'x-1', 'l-1', 'r-1',
              'x-2', 'l-2', 'r-2',
              'x-3', 'l-3', 'r-3',
              'x-4', 'l-4', 'r-4',
              'x-5', 'l-5', 'r-5',
              'x-6', 'l-6', 'r-6',
              'x-7', 'l-7', 'r-7',
              'x-8', 'l-8', 'r-8',
              'x-9', 'l-9', 'r-9',
            ],
            ['mino'],
            'retro-special',
        )
        game.piece.useRetroColors = true
        game.colors = PIECE_COLORS.retroSpecial
      }
      game.stack.levelUpAnimation = 1000
      game.stack.levelUpAnimationLimit = 450
      $('#zen_panel').style.display = "none"
      game.updateStats()
      game.piece.lockDownType = null
      game.drawLockdown()
    },
  },
}
