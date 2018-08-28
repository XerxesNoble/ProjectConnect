import initStage from './stage'
import Engine from './engine'

initStage('#gameStage', (canvas) => {
  const game = new Engine(canvas)
  game.start();
})
