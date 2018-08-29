import controls from './controls'
import map from './map'
import audio from './audio'
import { EVENTS } from './constants'
import dispatcher from './utils/dispatcher'



export default class Engine{
  constructor(canvas){
    this.canvas = canvas
    this.context = canvas.getContext('2d')
    // Level Generation, get all objects that will be in the game
    // obstacles, monsters, powerps, player, end
    this.game = {...(map(this.canvas, this.context))}
  }

  start(){
    this.loop();
  }

  stop() {
    // TODO - Stop engine
  }

  loop(){
    // Clear drawing
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

    // Draw background
    this.context.globalAlpha = 1
    this.context.fillStyle = `#121212`
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)

    // Update player from controls
    if (controls.jump && (!this.game.player.jump && this.game.player.grnd)) {
      this.game.player.jump = true
      this.game.player.grnd = false
      this.game.player.v.y = -this.game.player.speed * 2.5 // jump height
      audio.jump()
    }
    if (controls.right && (this.game.player.v.x < this.game.player.speed)) this.game.player.v.x++
    if (controls.left && (this.game.player.v.x > -this.game.player.speed)) this.game.player.v.x--

    // Apply environment settings
    this.game.player.v.x *= 0.8 // friction
    // TODO - make this variable based on screen size
    this.game.player.v.y += 0.25 // gravity
    this.game.player.grnd = false

    // Check for a collision with an obstacle
    this.game.obstacles.forEach(obstacle => {
      const [direction, adjustment] = obstacle.collides(this.game.player)
      if (direction === 'left' || direction === 'right') {
        this.game.player.v.x = 0
        this.game.player.jump = false
        this.game.player.x += adjustment
      } else if (direction === 'bottom') {
        this.game.player.grnd = true
        this.game.player.jump = false
        this.game.player.y += adjustment
      } else if (direction === 'top') {
        this.game.player.v.y *= -1
        this.game.player.y += adjustment
      }
      obstacle.draw()

      // Game end - Fail!
      if(direction !== null && obstacle.deadzone) {
        dispatcher(this.canvas, EVENTS.LEVEL_FAIL)
      }
    })

    // Apply player v to position
    if (this.game.player.grnd) this.game.player.v.y = 0
    this.game.player.x += this.game.player.v.x
    this.game.player.y += this.game.player.v.y
    this.game.player.draw()


    // TODO: Test for collision with enemies and kill player
    // TODO: Test for collision outside of canvas, and kill player
    // TODO: Test for collision with battery-packs and reset lighting

    requestAnimationFrame(this.loop.bind(this))
  }

}
