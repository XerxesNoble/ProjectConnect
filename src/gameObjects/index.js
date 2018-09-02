import { checkCollision } from '../utils/collision'
import { BATTERY_LIFE } from '../constants'
import GameObject from './GameObject'


function reduceBatteryLife(player) {
  const reducedValue = player.batteryLife - 0.3
  const frame = () => {
    player.batteryLife -= 0.001
    if (player.batteryLife > reducedValue) requestAnimationFrame(frame)
  }
  frame()
  // TODO: Trigger update of Battery HUD here.
  // TODO: Listen for battery pickup event to stall reduction
}

export default context => ({
  player: {
    x: 0,
    y: 0,
    width: 25,
    height: 25,
    speed: 3,
    hspeed: context.dpr > 1 ? 4 : 3,
    v: {
      x: 0,
      y: 0
    },
    jump: false,
    grnd: false,
    batteryLife: 1,
    draw() {
      // Update player based on movement (TODO: use a sprite)
      context.fillStyle = 'lightblue'
      if (this.jump) context.fillStyle = 'orange'
      // if (controls.right) context.fillStyle = 'red'
      // if (controls.left) context.fillStyle = 'lightgreen'
      context.fillRect(this.x, this.y, this.width, this.height)
    },
    getBatteryLife() {
      if (!this._lastChecked) {
        this._lastChecked = Date.now()
      } else if (Date.now() - this._lastChecked > (BATTERY_LIFE / 3)) {
        this._lastChecked = Date.now()
        if (this.batteryLife > 0.1) reduceBatteryLife(this) // Don't go under 0.1
      }

      return this.batteryLife
    },
    increaseBattery(power) {
      this._lastChecked = Date.now()
      this.batteryLife = Math.min(this.batteryLife + power, 1) // Clamp battery power at 1
    }
  },
  obstacle(x, y, width, height) {
    const fill = '#212121'
    return new GameObject({ x, y, width, height, fill, context })
  },
  endSuccess(x, y, width, height) {
    const fill = '#f00'
    return new GameObject({ x, y, width, height, fill, context })
  },
  deadzone(x, y, width, height) {
    const fill = '#f00'
    const dz = new GameObject({ x, y, width, height, fill, context })
    dz.deadzone = true
    return dz
  },
  batteryPack(x, y, width, height) {
    const fill = '#388E3C'
    const bp = new GameObject({ x, y, width, height, fill, context })
    bp.collected = false
    bp.power = 0.3
    return bp
  },
  enemy(x, y, width, height) {
    const fill = ['#D32F2F', '#F44336'][Math.floor(Math.random() * 2)]
    const enemy = new GameObject({ x, y, width, height, fill, context })
    enemy.origin = { x, y }
    enemy.speed = Math.random() * 5
    return enemy
  },
  door(x, y, width, height) {
    const fill = 'purple'
    return new GameObject({ x, y, width, height, fill, context })
  }
})
