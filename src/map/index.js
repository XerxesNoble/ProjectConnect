import gameObjects from '../gameObjects'
import levels from './levels'

let currentLevel = levels[0];

export default (canvas, context) => {
  // Object factories
  const { player, obstacle, deadzone } = gameObjects(context)

  // Collections for map
  const obstacles = []
  const monsters = []
  const powerps = []
  const end = { x: 0, y: 0 }

  const size = Math.floor(canvas.height / currentLevel.length)
  currentLevel.forEach((row, i) => {
    const y = i * size
    row.split('').forEach((block, j) => {
      const x = j * size
      switch (block) {
        case '*':
          obstacles.push(obstacle(x, y, size, 25))
          break
        case '%':
          // TODO: Monster
          break
        case '#':
          // TODO: Powerup
          break
        case '$':
          end.x = x
          end.y = y
          break
        case 'P':
          player.x = x
          player.y = y
          break
        default:
          void 0
      }
    })
  })

  // Add deadzone
  for(let i = 0; i < currentLevel[0].length; i ++) {
    obstacles.push(deadzone(i * size, canvas.height + 50, size))
  }

  return { obstacles, monsters, powerps, player, end }
}
