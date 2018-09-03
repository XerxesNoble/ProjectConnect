import controls from './controls'
import map from './map'
import audio from './audio'
import { EVENTS } from './constants'
import dispatcher from './utils/dispatcher'

export default class Engine {
  constructor(context, hud) {
    this.hud = hud
    this.views = {
      battery: document.getElementById('battery'),
      currentLevel: document.getElementById('currentLevel'),
      lives: document.getElementById('lives'),
      powerups: document.getElementById('collected-powerups'),
    }
    this.context = context
    this.canvas = context.canvas
    this.currentLevel = 0

    // When player reaches goal, Go to next map
    this.canvas.addEventListener(EVENTS.LEVEL_COMPLETE, () => {
      this.currentLevel++
      if (this.currentLevel === map.levels.length) {
        // YOU WIN!
      } else {
        // Next Level
        this.startLevel()
      }
    })

    this.friction = 0.8
    this.jumpHeight = this.context._spriteSize / 10 // 2.5 (non-retina)
    this.gravity = this.context._spriteSize / 100 // 0.25 (non-retina)

    this.startLevel()
  }

  startLevel() {
    // Level Generation, get all objects that will be in the game
    // obstacles, monsters, powerps, player, end
    this.game = {...(map(this.canvas, this.context, this.currentLevel))}
  }

  start() {
    this.run = true
    this.loop();
  }

  stop() {
    this.run = false
  }

  updateHUD() {
    const { battery, currentLevel, lives, powerups } = this.views

    battery.innerHTML = `Battery: ${(this.game.player.getBatteryLife() * 100).toFixed(1)}%`
    currentLevel.innerHTML = `Level: ${this.currentLevel + 1}`

    // TODO: Implement lives system
    lives.innerHTML = `Lives: ${this.lives || 3}`
    // TODO: Implement powerup collection
    powerups.innerHTML = `Powerups: ${this.game.collectedPowerups}/${this.game.totalPowerups}`
  }

  loop() {
    if (this.run === false) return
    this.updateHUD()
    // Clear drawing
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

    // Draw background
    this.context.globalAlpha = 1
    this.context.fillStyle = `#000000`
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
    this.context.globalAlpha = this.game.player.getBatteryLife()
    this.context.fillStyle = `#121212`
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)

    // Update player from controls
    if (controls.jump && (!this.game.player.jump && this.game.player.grnd)) {
      this.game.player.jump = true
      this.game.player.grnd = false
      this.game.player.v.y = -this.game.player.speed * this.jumpHeight // jump height
      audio.jump()
    }
    if (controls.right && (this.game.player.v.x < this.game.player.hspeed)) this.game.player.v.x++
    if (controls.left && (this.game.player.v.x > -this.game.player.hspeed)) this.game.player.v.x--

    // Apply environment settings
    this.game.player.v.x *= this.friction
    this.game.player.v.y += this.gravity

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
      // TODO: Bug here if player falls outside at the end
      if(direction !== null && obstacle.deadzone) {
        dispatcher(this.canvas, EVENTS.LEVEL_FAIL)
      }
    })

    // Apply player v to position
    if (this.game.player.grnd) this.game.player.v.y = 0
    this.game.player.x += this.game.player.v.x
    this.game.player.y += this.game.player.v.y
    this.game.player.draw()


    // Test for collision with battery-packs and reset lighting
    this.game.powerups.forEach(batteryPack => {
      // If batter has not been collected yet
      if (batteryPack.collected === false) {
        // If player collides with battery, increase power
        if (batteryPack.collides(this.game.player)[0]) {
          this.game.player.increaseBattery(batteryPack.power)
          batteryPack.collected = true
          this.game.collectedPowerups++
          audio.powerup()
        } else {
          batteryPack.draw()
        }
      }
    })


    // Test for collision with enemies and kill player
    this.game.monsters.forEach(enemy => {
      const [direction] = enemy.collides(this.game.player)
      if (direction) dispatcher(this.canvas, EVENTS.LEVEL_FAIL) // TODO: Ability to kill enemy?
      // Test if enemy is outside of game view
      const [inView] = enemy.collides({
        x: 0,
        y:0,
        width: this.canvas.width,
        height: this.canvas.height
      })
      // If outside of view, reset position
      if (!inView) {
        enemy.x = enemy.origin.x
        enemy.y = enemy.origin.y
      }
      enemy.draw()
    })


    // Player has reached end
    if (this.game.end.collides(this.game.player)[0]) {
      audio.win()
      // TODO - Trigger level complete animation
      dispatcher(this.canvas, EVENTS.LEVEL_COMPLETE)
    } else {
      this.game.end.draw()
    }


    // TODO: Test for collision outside of canvas, and kill player

    requestAnimationFrame(this.loop.bind(this))
  }

}
