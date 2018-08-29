import { checkCollision } from '../utils/collision'

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
    return {
      x,
      y,
      width,
      height,
      collides(player) {
        return checkCollision(player, this)
      },
      draw() {
        context.fillStyle = '#212121'
        this.x -= 1
        context.fillRect(this.x, this.y, this.width, this.height)
      }
    }
  },
  endSuccess(x, y, width, height) {
    return {
      x,
      y,
      width,
      height,
      collides(player) {
        return checkCollision(player, this)
      },
      draw() {
        context.fillStyle = '#f00'
        this.x -= 1
        context.fillRect(this.x, this.y, this.width, this.height)
      }
    }
  },
  deadzone(x, y, width = 25, height = 10) {
    return {
      x,
      y,
      width,
      height,
      deadzone: true,
      collides(player) {
        return checkCollision(player, this)
      },
      draw() {
        context.fillStyle = '#ffffff'
        this.x -= 1
        context.fillRect(this.x, this.y, this.width, this.height)
      }
    }
  },
})
