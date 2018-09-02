import gameObjects from '../gameObjects'
import levels from './levels'

const map = (canvas, context, levelIndex = 1) => {
  const currentLevel = levels[levelIndex];
  // Object factories
  const { player, obstacle, deadzone, batteryPack, enemy, door } = gameObjects(context)

  // Collections for map
  const obstacles = []
  const monsters = []
  const powerups = []
  let end
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
          end = door(x, y, spriteSize, spriteSize)
          break
        case 'P':
          player.x = x
          player.y = y
          player.width = player.height = spriteSize
          break
        default:
          void 0
      }
    })
  })

  // Add deadzone
  for(let i = 0; i < currentLevel[levelIndex].length; i ++) {
    obstacles.push(deadzone(i * size, canvas.height + 50, size))
  }


  return { obstacles, monsters, powerups, player, end }
}

map.levels = levels // yolo
export default map
