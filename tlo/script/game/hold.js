import GameModule from './game-module.js'
import $, {clearCtx, resetAnimation} from '../shortcuts.js'
//import * as randomizer from './modules/randomizers.js'
import {PIECE_SETS, PIECES, MONOMINO_PIECES, DOMINO_PIECES, TROMINO_PIECES, PENTOMINO_PIECES, INITIAL_ORIENTATION} from '../consts.js'
import sound from '../sound.js'
import settings from '../settings.js'

export default class Hold extends GameModule {
  constructor(parent, ctx) {
    super(parent)
    this.ctx = ctx
    this.pieceName = null
    this.isLocked = false
    this.ihs = false
    this.ihsAmount = 0
    this.isDisabled = false
    this.useSkip = false
    this.hasHeld = false
    window.hasHeld = false
    this.holdAmount = 0
    this.holdAmountLimit = 0
    this.gainHoldOnPlacement = false
  }
  getPiece() {
    return (this.pieceName) ? this.pieceName : (this.parent.piece.inAre) ? this.parent.next.queue[1] : this.parent.next.queue[0]
  }
  hold() {
    if (((this.isLocked && (this.parent.type !== 'zen' || game.cfghold == 'OFF')) && !this.useSkip) || this.isDisabled || (this.holdAmount <= 0 && this.holdAmountLimit > 0)) {return}
    if (this.holdAmountLimit > 0) {this.holdAmount--}
    this.hasHeld = true
    window.hasHeld = true
    if (this.ihs) {
      if (this.useSkip) {
        sound.add('initialskip')
        this.parent.stat.skipCount++
      } else {sound.add('initialhold')}
    } else {
      if (this.useSkip) {
        sound.add('skip')
        this.parent.stat.skipCount++
      } else {sound.add('hold')}
    }
    this.ihsAmount--
    if (this.ihsAmount <= 0) {this.ihs = false}
    const swapPiece = this.pieceName
    this.pieceName = this.parent.piece.name
    if (swapPiece == null || this.useSkip) {this.parent.piece.new()}
    else {this.parent.piece.new(swapPiece)}
    this.isDirty = true
    this.isLocked = true
    resetAnimation('#hold-container', 'flash')
  }
  draw() {
    if (this.parent.noHold) {$('.hold-label').style.textDecoration = "line-through"}
    else {$('.hold-label').style.textDecoration = ""}
    if (this.isDisabled) {$('#hold-container').classList.add('hidden')}
    else {$('#hold-container').classList.remove('hidden')}
    if (this.useSkip) {
      if (this.parent.type !== 'zen' || game.cfghold == 'OFF') { $('#skip-amount').textContent = this.holdAmount }
      // else { $('#skip-amount').innerHTML = '∞' }
      else { $('#skip-amount').innerHTML = this.parent.stat.skipCount }
      return
    } else {$('#skip-amount').textContent = ''}
    if (this.pieceName === null) {return}
    if (this.parent.type !== 'zen' || game.cfghold == 'OFF') {
      if (this.isLocked || this.useSkip) {$('#hold').classList.add('locked')}
      else {$('#hold').classList.remove('locked')}
    }
    clearCtx(this.ctx)
    if (this.isDisabled) {return}
    let shape
    switch(settings.settings.shapeOverride) {
      case 'mono':
        shape = MONOMINO_PIECES[this.pieceName].shape[INITIAL_ORIENTATION[this.parent.rotationSystem][this.pieceName]]
        break
      case 'do':
        shape = DOMINO_PIECES[this.pieceName].shape[INITIAL_ORIENTATION[this.parent.rotationSystem][this.pieceName]]
        break
      case 'tro':
        shape = TROMINO_PIECES[this.pieceName].shape[INITIAL_ORIENTATION[this.parent.rotationSystem][this.pieceName]]
        break
      case 'pento':
        shape = PENTOMINO_PIECES[this.pieceName].shape[INITIAL_ORIENTATION[this.parent.rotationSystem][this.pieceName]]
        break
      default:
        shape = PIECES[this.pieceName].shape[INITIAL_ORIENTATION[this.parent.rotationSystem][this.pieceName]]
        break
    }
    const cellSize = this.parent.cellSize
    const ctx = this.ctx
    if (this.parent.stat.level >= 800 && this.parent.type == 'pandaemonium') {
      game.piecedisp = ["T", "J", "Z", "O", "S", "L", "I"][Math.floor(Math.random() * 7)]
      game.shapedisp = PIECES[game.piecedisp].shape[INITIAL_ORIENTATION[this.parent.rotationSystem][game.piecedisp]]
      const offset = this.parent.nextOffsets[game.piecedisp]
      for (let y = 0; y < game.shapedisp.length; y++) {
        for (let x = 0; x < game.shapedisp[y].length; x++) {
          const img = document.getElementById(`mino-${this.parent.colors[this.pieceName]}`)
          if (game.shapedisp[y][x]) {
            const xPos = x * cellSize + offset[0] * cellSize
            const yPos = y * cellSize + offset[1] * cellSize
            img.height = cellSize
            ctx.drawImage(img, xPos, Math.floor(yPos), cellSize, cellSize)
          }
        }
      }
    }
    else {
      const offset = this.parent.nextOffsets[this.pieceName]
      for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
          const img = document.getElementById(`mino-${this.parent.colors[this.pieceName]}`)
          if (shape[y][x]) {
            const xPos = x * cellSize + offset[0] * cellSize
            const yPos = y * cellSize + offset[1] * cellSize
            img.height = cellSize
            ctx.drawImage(img, xPos, Math.floor(yPos), cellSize, cellSize)
          }
        }
      }
    }
  }
}
