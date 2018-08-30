import initStage from './stage'
import Engine from './engine'
import { EVENTS } from './constants'
import audio from './audio'


const game = {
  start() {
    this.canvas = initStage('#gameStage')
    this.engine = new Engine(this.canvas)

    // Add Events
    this._gameFailSequence = this.gameFailSequence.bind(this)
    this.canvas.addEventListener(EVENTS.LEVEL_FAIL, this._gameFailSequence)

    // Start game loop
    this.engine.start()
  },
  gameFailSequence() {
    this.canvas.removeEventListener(EVENTS.LEVEL_FAIL, this._gameFailSequence);
    console.log('Yo, don\'t suck');
    audio.die()
    this.engine.stop();
    // TODO - Display Retry Screen
    setTimeout(() => window.location.reload(), 3000);
  }
}


game.start()
