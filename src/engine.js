import controls from './controls'
import map from './map'
import audio from './audio'
import { EVENTS, BATTERY_STATES, GAME_LIVES, MAX_VISION } from './constants'
import dispatcher from './utils/dispatcher'

export default class Engine {
  constructor(context, hud, assets) {
    this.assets = assets
    this.hud = hud
    this.lives = GAME_LIVES
    this.views = {
      battery: {
        container: document.getElementById('battery'),
        bar: document.getElementById('batteryBar'),
        barInner: document.getElementById('batteryBarInner'),
        percent: document.getElementById('batteryPercent'),
      },
      currentLevel: document.getElementById('currentLevel'),
      lives: document.getElementById('lives'),
      powerups: document.getElementById('collected-powerups'),
    }
    this.context = context
    this.canvas = context.canvas
    this.currentLevel = 0

    // When player reaches goal, Go to next map
    this.canvas.addEventListener(EVENTS.LEVEL_COMPLETE, this.levelCompleteHandler.bind(this))
    this.canvas.addEventListener(EVENTS.LEVEL_FAIL, this.livesHandler.bind(this))
    this.canvas.addEventListener(EVENTS.GAME_STATE_PAUSE, this.stop.bind(this))
    this.canvas.addEventListener(EVENTS.GAME_STATE_PLAY, this.start.bind(this))

    this.friction = 0.8
    this.jumpHeight = this.context._spriteSize / 10 // 2.5 (non-retina)
    this.gravity = this.context._spriteSize / 100 // 0.25 (non-retina)

    this.startLevel()
  }

  startLevel() {
    // Level Generation, get all objects that will be in the game
    // obstacles, monsters, powerps, player, end
    this.game = {...(map(this.canvas, this.context, this.assets, this.currentLevel))}
  }

  start() {
    this.run = true
    this.loop()
  }

  stop() {
    this.run = false
  }

  setupHUD() {
    this.HUDisSet = true;
    const { container, bar } = this.views.battery
    const w = container.getBoundingClientRect().width;
    bar.style.width = `${w}px`;
  }

  setBatteryState(newState) {
    const { barInner } = this.views.battery
    if(barInner.classList.contains(newState)) return
    Object.keys(BATTERY_STATES).forEach((state) => {
      barInner.classList.remove(BATTERY_STATES[state])
    })
    barInner.classList.add(newState)
  }

  livesHandler() {
    this.canvas.removeEventListener(EVENTS.LEVEL_FAIL, this.livesHandler)
    this.lives-- // Remove a life
    if (this.lives === -1) {
      // this.stop()
      dispatcher(this.canvas, EVENTS.GAME_OVER)
    } else {
      audio.die()
      this.startLevel()
    }
  }

  levelCompleteHandler() {
    this.currentLevel++
    if (this.currentLevel === map.levels.length) {
      // YOU WIN!
      dispatcher(this.canvas, EVENTS.GAME_WIN)
    } else {
      // Next Level
      this.startLevel()
    }
  }

  updateHUD() {
    if(!this.HUDisSet) this.setupHUD()
    const { battery, currentLevel, lives, powerups } = this.views

    currentLevel.innerHTML = `Level: ${this.currentLevel + 1}`

    // TODO: Implement lives system
    lives.innerHTML = `Lives: ${this.lives}`

    // TODO: Implement powerup collection
    powerups.textContent = `${this.game.collectedPowerups}/${this.game.totalPowerups}`

    // Battery
    const batteryCharge = (this.game.player.getBatteryLife() * 100).toFixed(1)
    battery.percent.textContent = `${batteryCharge}%`
    battery.barInner.style.width = `${batteryCharge}%`
    // Bar color
    if(batteryCharge >= 50) {
      this.setBatteryState(BATTERY_STATES.HIGH)
      battery.barInner.classList.add('healthy')
    } else if(batteryCharge < 50 && batteryCharge > 25) {
      this.setBatteryState(BATTERY_STATES.MEDIUM)
    } else if(batteryCharge <= 25) {
      this.setBatteryState(BATTERY_STATES.LOW)
    }

    currentLevel.textContent = `Level: ${this.currentLevel + 1}`
  }

  loop() {
    if (this.run === false) return
    const { player, obstacles, powerups, monsters, shadowGenerator } = this.game

    this.updateHUD()
    // Clear drawing
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

    // Update player from controls
    if (controls.jump && (!player.jump && player.grnd)) {
      player.jump = true
      player.grnd = false
      player.v.y = -player.speed * this.jumpHeight // jump height
      audio.jump()
    }
    if (controls.right && (player.v.x < player.hspeed)) player.v.x += 1
    if (controls.left && (player.v.x > -player.hspeed)) player.v.x -= 2 // Account for moving map

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

    // Draw Shadow
    const vision = MAX_VISION * player.getBatteryLife()
    const shadow = shadowGenerator.getVisibilityPolygons(
      player.x + player.width / 2,
      player.y + player.height / 2,
      vision
    )
    shadow.drawShadow()

    // Apply player v to position
    if (player.grnd) player.v.y = 0
    player.x += player.v.x
    player.y += player.v.y
    player.draw(controls)


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
      // If enemy has not yet come into view
      const resetPosition = enemy.origin.x - this.game.distanceTravelled
      if (enemy.x < 0 && resetPosition > this.canvas.width) enemy.x = resetPosition
      else enemy.draw()
    })

    // Player reached objective
    if (this.game.objective) {
      if(!player.hasObjective && this.game.objective.collides(player)[0]) {
        player.hasObjective = true
        audio.win()
      } else if(!player.hasObjective) {
        this.game.objective.draw()
      }
    }


    // Player has reached end
    if (this.game.end.collides(player)[0]) {
      if(player.hasObjective) {
        player.hasObjective = false
        audio.win()
        dispatcher(this.canvas, EVENTS.LEVEL_COMPLETE)
      } else {
        // TODO - Create error sound
        // play error sound
      }
    } else {
      this.game.end.draw()
    }

    this.game.distanceTravelled++
    requestAnimationFrame(this.loop.bind(this))
  }

}
