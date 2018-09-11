import { checkCollision } from '../utils/collision'
import { BATTERY_LIFE } from '../constants'
import GameObject from './GameObject'


function reduceBatteryLife(player) {
  const reducedValue = player.batteryLife - 0.3
  const frame = () => {
    if (player.cancelDecay) return (player.cancelDecay = false)
    player.batteryLife -= 0.001
    if (player.batteryLife > reducedValue) requestAnimationFrame(frame)
  }
  frame()
}

export default (context, assets) => ({
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
      // context.fillStyle = 'lightblue'
      context.drawImage(assets['player'], this.x, this.y, this.width * 2, this.height)
      if (this.jump) context.drawImage(assets['player-jumping'], this.x, this.y, this.width * 2, this.height)
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
      this.cancelDecay = true
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
    const fill = null
    const asset = assets['battery-pickup']
    const bp = new GameObject({ x, y, width, height, fill, context, asset })
    bp.collected = false
    bp.power = 0.3
    return bp
  },
  enemy(x, y, width, height) {
    const fill = null
    const asset = assets['robot']
    const enemy = new GameObject({ x, y, width, height, fill, context, asset })
    enemy.origin = { x, y }
    enemy.speed = Math.random() * 5
    return enemy
  },
  door(x, y, width, height) {
    const fill = null
    const asset = assets['ethernet-port']
    return new GameObject({ x, y, width, height, fill, context, asset })
  },
  goal(x, y, width, height) {
    const fill = null
    const asset = assets['ethernet']
    return new GameObject({ x, y, width, height, fill, context, asset })
  }
})
