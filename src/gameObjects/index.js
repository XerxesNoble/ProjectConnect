import { checkCollision } from '../utils/collision'
import { checkCollision } from '../utils/collision'
import { BATTERY_LIFE } from '../constants'
import GameObject from './GameObject'


function reduceBatteryLife(player) {
  const bl = player.batteryLife
  const reduce = () => player.batteryLife -= 0.001
  if (bl > 0.7) {
    while (bl > 0.7)
  }
}

export default context => ({
  player: {
    x: 0,
    y: 0,
    width: 25,
    height: 25,
    speed: 3,
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
      } else if (Date.now() - this._lastChecked > (BATTERY_LIFE * 1000 / 3)) {
        this.batteryLife -= 0.3
        this._lastChecked = Date.now()
        reduceBatteryLife(this)
        console.log('BANG!')
      }
      return this.batteryLife
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
  deadzone(x, y, width = 25, height = 10) {
    const fill = '#f00'
    const dz = new GameObject({ x, y, width, height, fill, context })
    dz.deadzone = true
    return dz
  },
})
