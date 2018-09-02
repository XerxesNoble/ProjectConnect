import gameObjects from '../gameObjects'
import levels from './levels'

let currentLevel = levels[1];

export default (canvas, context) => {
  // Object factories
  const { player, obstacle, deadzone, batteryPack, enemy } = gameObjects(context)

  // Collections for map
  const obstacles = []
  const monsters = []
  const powerups = []
  const end = { x: 0, y: 0 }
  const spriteSize = context._spriteSize
  const size = Math.floor(canvas.height / currentLevel.length)
  currentLevel.forEach((row, i) => {
    const y = i * size
    row.split('').forEach((block, j) => {
      const x = j * size
      switch (block) {
        case '*':
          obstacles.push(obstacle(x, y, size, spriteSize))
          break
        case '%':
          monsters.push(enemy(x, y, spriteSize, spriteSize))
          break
        case '#':
          powerups.push(batteryPack(x, y, spriteSize, spriteSize))
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

  player.width = player.height = spriteSize

  return { obstacles, monsters, powerups, player, end }
}
