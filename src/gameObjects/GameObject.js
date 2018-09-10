import { checkCollision } from '../utils/collision'

export default class GameObject {
  constructor({x, y, width, height, fill, context}) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.fill = fill
    this.context = context
  }

  collides(player) {
    return checkCollision(player, this)
  }

  inBounds(b) {
    const bounds = b || {
      x: 0,
      y: 0,
      width: this.context.canvas.width,
      height: this.context.canvas.height
    }
    return !(
      ((this.y + this.height) < (bounds.y)) ||
      (this.y > (bounds.y + bounds.height)) ||
      ((this.x + this.width) < bounds.x) ||
      (this.x > (bounds.x + bounds.width))
    )
  }

  draw(render = true, move = true) {
    if (move) this.x -= this.speed || 1
    if (render && this.inBounds()) {
      this.context.fillStyle = this.fill
      this.context.fillRect(this.x, this.y, this.width, this.height)
    }
  }
}
