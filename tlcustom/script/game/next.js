import GameModule from './game-module.js';
import $, {clearCtx} from '../shortcuts.js';
import * as randomizer from './modules/randomizers.js';
import {PIECE_SETS, PIECES, MONOMINO_PIECES, DOMINO_PIECES, TROMINO_PIECES, PENTOMINO_PIECES, INITIAL_ORIENTATION} from '../consts.js';
import sound from '../sound.js';
import settings from '../settings.js';

export default class Next extends GameModule {
  constructor(parent, ctx, ctxSub, seed) {
    super(parent);
    this.ctx = ctx;
    this.subCtx = ctxSub;
    this.nextLength = this.parent.userSettings.nextLength;
    this.nextLimit = 6;
    this.queue = [];
    this.stats = {};
    this.seed = seed;
    this.rng = new Math.seedrandom(this.seed);
    this.reset();
    for (const piece of Object.keys(PIECES)) {
      this.stats[piece] = 0;
    }
    for (let i = 0; i < 9; i++) {
      this.generate();
    }
  }
  reset() {
    this.gen = randomizer[this.parent.settings.randomizer](PIECE_SETS[this.parent.settings.pieces], PIECE_SETS[this.parent.settings.unfavored], this.rng);
  }
  next() {
    this.generate();
    this.isDirty = true;
    sound.add(`piece${this.queue[1]}`);
    return this.queue.shift();
  }
  generate() {
    const generated = this.gen.next().value;
    this.queue.push(generated);
    this.stats[generated]++;
  }
  drawMino(x, y) {
    const cellSize = this.parent.cellSize;
    const ctx = this.ctx;
    const xPos = x * cellSize;
    const yPos = y * cellSize;
    const img = document.getElementById(`mino-${this.color}`);
    img.height = cellSize;
    ctx.globalCompositeOperation = 'source-over';

    ctx.drawImage(img, xPos, Math.floor(yPos), cellSize, cellSize);
  }

  draw() {
    this.nextLength = Math.min(this.nextLength, this.nextLimit);
    clearCtx(this.ctx);
    clearCtx(this.subCtx);
    if (this.nextLength <= 0) {
      $('#main-next-container').classList.add('hidden');
      return;
    } else {
      $('#main-next-container').classList.remove('hidden');
    }
    const piece = this.queue[0];
    let shape;
    switch(settings.settings.shapeOverride) {
      case 'mono':
        shape = MONOMINO_PIECES[piece].shape[INITIAL_ORIENTATION[this.parent.rotationSystem][piece]];
        break;
      case 'do':
        shape = DOMINO_PIECES[piece].shape[INITIAL_ORIENTATION[this.parent.rotationSystem][piece]];
        break;
      case 'tro':
        shape = TROMINO_PIECES[piece].shape[INITIAL_ORIENTATION[this.parent.rotationSystem][piece]];
        break;
      case 'pento':
        shape = PENTOMINO_PIECES[piece].shape[INITIAL_ORIENTATION[this.parent.rotationSystem][piece]];
        break;
      default:
        shape = PIECES[piece].shape[INITIAL_ORIENTATION[this.parent.rotationSystem][piece]];
        break;
    }
    let cellSize = this.parent.cellSize;
    const offset = this.parent.nextOffsets[piece];
    let ctx = this.ctx;

    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        const color = this.parent.colors[piece];
        let suffix = '';
        if (this.parent.piece.useSpecialI && piece === 'I') {
          suffix = shape[y][x];
        }
        if (this.parent.piece.useRetroColors) {
          suffix = `-${this.parent.stat.level % 10}`;
        }
        const img = document.getElementById(`mino-${color}${suffix}`);
        const isFilled = shape[y][x];
        if (isFilled && window.noNext == false) {
          const xPos = x * cellSize + offset[0] * cellSize;
          const yPos = y * cellSize + offset[1] * cellSize;
          img.height = cellSize;
          ctx.drawImage(img, xPos, Math.floor(yPos), cellSize, cellSize);
        }
      }
    }
    cellSize = Math.floor(cellSize * .62);
    ctx = this.subCtx;
    const nextCount = this.nextLength - 1;
    const multiplier = 3;
    for (let nextSpace = 0; nextSpace < nextCount; nextSpace++) {
      const piece = this.queue[nextSpace + 1];
      let shape;
      switch(settings.settings.shapeOverride) {
        case 'mono':
          shape = MONOMINO_PIECES[piece].shape[INITIAL_ORIENTATION[this.parent.rotationSystem][piece]];
          break;
        case 'do':
          shape = DOMINO_PIECES[piece].shape[INITIAL_ORIENTATION[this.parent.rotationSystem][piece]];
          break;
        case 'tro':
          shape = TROMINO_PIECES[piece].shape[INITIAL_ORIENTATION[this.parent.rotationSystem][piece]];
          break;
        case 'pento':
          shape = PENTOMINO_PIECES[piece].shape[INITIAL_ORIENTATION[this.parent.rotationSystem][piece]];
          break;
        default:
          shape = PIECES[piece].shape[INITIAL_ORIENTATION[this.parent.rotationSystem][piece]];
          break;
      }
      if (window.panlvl >= 500) {
        game.shapedisp0 = Math.floor(Math.random() * 7);
        if (game.shapedisp0 == 0) game.piecedisp = "T";
        else if (game.shapedisp0 == 1) game.piecedisp = "J";
        else if (game.shapedisp0 == 2) game.piecedisp = "Z";
        else if (game.shapedisp0 == 3) game.piecedisp = "O";
        else if (game.shapedisp0 == 4) game.piecedisp = "S";
        else if (game.shapedisp0 == 5) game.piecedisp = "L";
        else if (game.shapedisp0 == 6) game.piecedisp = "I";
        game.shapedisp = PIECES[game.piecedisp].shape[INITIAL_ORIENTATION[this.parent.rotationSystem][game.piecedisp]];
        const offset = this.parent.nextOffsets[game.piecedisp];
        for (let y = 0; y < game.shapedisp.length; y++) {
          for (let x = 0; x < game.shapedisp[y].length; x++) {
            const color = this.parent.colors[piece];
            const img = document.getElementById(`mino-${color}`);
            const isFilled = (game.shapedisp[y][x] !== 0);
            if (isFilled && window.noNext == false) {
              const xPos = x * cellSize + offset[0] * cellSize;
              const yPos = y * cellSize + offset[1] * cellSize + nextSpace * cellSize * multiplier;
              img.height = cellSize;
              ctx.drawImage(img, Math.floor(xPos), Math.floor(yPos), cellSize, cellSize);
            }
          }
        }
      }
      else {
      const offset = this.parent.nextOffsets[piece];
      for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
          const color = this.parent.colors[piece];
          const img = document.getElementById(`mino-${color}`);
          const isFilled = shape[y][x];
          if (isFilled && window.noNext == false) {
            const xPos = x * cellSize + offset[0] * cellSize;
            const yPos = y * cellSize + offset[1] * cellSize + nextSpace * cellSize * multiplier;
            img.height = cellSize;
            ctx.drawImage(img, Math.floor(xPos), Math.floor(yPos), cellSize, cellSize);
          }
        }
      }
      }
    }
  }
}
