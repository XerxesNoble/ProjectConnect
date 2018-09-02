import initStage from './stage'
import Engine from './engine'
import { EVENTS } from './constants'
import audio from './audio'


const game = {
  start() {
    this.context = initStage('#gameStage')
    this.canvas = this.context.canvas
    const hud = document.getElementById('hud')
    this.engine = new Engine(this.context, hud)

    // Add Events
    this._gameFailSequence = this.gameFailSequence.bind(this)
    this.canvas.addEventListener(EVENTS.LEVEL_FAIL, this._gameFailSequence)

    // Start game loop
    this.engine.start()
    // this.engine.stop()
  },
  gameFailSequence() {
    this.canvas.removeEventListener(EVENTS.LEVEL_FAIL, this._gameFailSequence);
    audio.die()
    this.engine.stop();
    // TODO - Display Retry Screen
    setTimeout(() => window.location.reload(), 3000);
  },
  frame() {
    this.engine.start()
    this.engine.stop()
  }
}





// Screen initializers
function initStartScreen(){
  return game.start() // DEBUG

  const ss = document.getElementById('startScreen')
  ss.classList.add('is-active');
  ss.querySelector('.start-game-cta').addEventListener('click', () => {
    closeCurrentScreen();
    game.start();
  })
}

function closeCurrentScreen() {
  document.querySelector('.screen-state.is-active').classList.remove('is-active')
}


window.game = game // For debugging
initStartScreen()
