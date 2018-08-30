import { checkCollision } from '../utils/collision'
import GameObject from './GameObject'

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
    draw() {
      // Update player based on movement (TODO: use a sprite)
      context.fillStyle = 'lightblue'
      if (this.jump) context.fillStyle = 'orange'
      // if (controls.right) context.fillStyle = 'red'
      // if (controls.left) context.fillStyle = 'lightgreen'
      context.fillRect(this.x, this.y, this.width, this.height)
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
