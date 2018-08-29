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

  draw() {
    this.context.fillStyle = this.fill
    this.x -= 1
    this.context.fillRect(this.x, this.y, this.width, this.height)
  }
}
