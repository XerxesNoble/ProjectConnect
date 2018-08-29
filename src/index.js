import initStage from './stage'
import Engine from './engine'
import { EVENTS } from './constants'

// TODO - Make this cleaner
let game, canvas

initStage('#gameStage', (_canvas) => {
  canvas = _canvas
  game = new Engine(canvas)

  // Global game triggers
  canvas.addEventListener(EVENTS.LEVEL_FAIL, gameFailSequence)

  game.start();
})


function gameFailSequence() {
  canvas.removeEventListener(EVENTS.LEVEL_FAIL, gameFailSequence);
  console.log('Yo, don\'t suck');
  game.stop();
  // TODO - Display Retry Screen
  setTimeout(() => window.location.reload(), 3000);
}
