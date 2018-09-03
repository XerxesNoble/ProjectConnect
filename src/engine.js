import controls from './controls'
import map from './map'
import audio from './audio'
import { EVENTS } from './constants'
import dispatcher from './utils/dispatcher'

export default class Engine {
  constructor(context, hud) {
    this.hud = hud
    this.lives = 3 // Game constant?
    
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

    this.canvas.addEventListener(EVENTS.LEVEL_FAIL, () => {
      this.lives-- // Remove a life
      if (this.lives === -1) dispatcher(this.canvas, EVENTS.GAME_OVER)
      else {
        // TODO: Retry screen? New Life?
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
    lives.innerHTML = `Lives: ${this.lives}`
    powerups.innerHTML = `Powerups: ${this.game.collectedPowerups}/${this.game.totalPowerups}`
  }

  loop() {
    const { player, obstacles, powerups, monsters } = this.game

    if (this.run === false) return
    this.updateHUD()
    // Clear drawing
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

    // Draw background
    this.context.globalAlpha = 1
    this.context.fillStyle = `#000000`
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
    this.context.globalAlpha = player.getBatteryLife()
    this.context.fillStyle = `#121212`
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)

    // Update player from controls
    if (controls.jump && (!player.jump && player.grnd)) {
      player.jump = true
      player.grnd = false
      player.v.y = -player.speed * this.jumpHeight // jump height
      audio.jump()
    }
    if (controls.right && (player.v.x < player.hspeed)) player.v.x++
    if (controls.left && (player.v.x > -player.hspeed)) player.v.x--

    // Apply environment settings
    player.v.x *= this.friction
    player.v.y += this.gravity

    player.grnd = false

    // Check for a collision with an obstacle
    obstacles.forEach(obstacle => {
      const [direction, adjustment] = obstacle.collides(player)
      if (direction === 'left' || direction === 'right') {
        player.v.x = 0
        player.jump = false
        player.x += adjustment
      } else if (direction === 'bottom') {
        player.grnd = true
        player.jump = false
        player.y += adjustment
      } else if (direction === 'top') {
        player.v.y *= -1
        player.y += adjustment
      }
      obstacle.draw()

      // Game end - Fail!
      if(direction !== null && obstacle.deadzone) {
        dispatcher(this.canvas, EVENTS.LEVEL_FAIL)
      }
    })

    // Apply player v to position
    if (player.grnd) player.v.y = 0
    player.x += player.v.x
    player.y += player.v.y
    player.draw()


    // Test for collision with battery-packs and reset lighting
    powerups.forEach(batteryPack => {
      // If batter has not been collected yet
      if (batteryPack.collected === false) {
        // If player collides with battery, increase power
        if (batteryPack.collides(player)[0]) {
          player.increaseBattery(batteryPack.power)
          batteryPack.collected = true
          this.game.collectedPowerups++
          // Add a life if all powerups are collected
          if (this.game.collectedPowerups === this.game.totalPowerups) this.lives++
          audio.powerup()
        } else {
          batteryPack.draw()
        }
      }
    })


    // Test for collision with enemies and kill player
    this.game.monsters.forEach(enemy => {
      const [direction] = enemy.collides(player)
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
    if (this.game.end.collides(player)[0]) {
      audio.win()
      // TODO - Trigger game end animation
      dispatcher(this.canvas, EVENTS.LEVEL_COMPLETE)
    } else {
      this.game.end.draw()
    }

    requestAnimationFrame(this.loop.bind(this))
  }

}
