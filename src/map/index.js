import gameObjects from '../gameObjects'
import levels from './levels'
import ShadowGenerator from '../utils/ShadowGenerator'

const map = (canvas, context, levelIndex = 1) => {
  const currentLevel = levels[levelIndex];
  // Object factories
  const { player, obstacle, deadzone, batteryPack, enemy, door, goal } = gameObjects(context)
  // Collections for map
  const obstacles = []
  const monsters = []
  const powerups = []
  let end
  let objective
  let totalPowerups = 0
  const spriteSize = context._spriteSize
  const size = Math.floor(canvas.height / currentLevel.length)
  currentLevel.forEach((row, i) => {
    const y = i * size
    let obstacleSize = 0
    row.split('').forEach((block, j, array) => {
      const x = j * size

      // Join all blocks into individual shapes
      if ((block !== '*' || !array[j + 1]) && obstacleSize > 0) {
        const width = size * obstacleSize
        obstacles.push(obstacle(x - width, y, width, spriteSize))
        obstacleSize = 0
      }

      switch (block) {
        case '*':
          obstacleSize++
          break
        case '%':
          monsters.push(enemy(x, y, spriteSize, spriteSize))
          break
        case '#':
          powerups.push(batteryPack(x, y, spriteSize, spriteSize))
          totalPowerups++
          break
        case '$':
          end = door(x, y, spriteSize * 2, spriteSize * 2)
          break
        case 'O':
          objective = goal(x, y, spriteSize * 2, spriteSize * 2)
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
  // Add 5 units of buffer at the end of the game and at the start of the game
  const dzBounds = {
    x: -(size * 5),
    y: canvas.height + 50,
    width: size * (currentLevel[levelIndex].length + 20),
    height: 1
  }

  obstacles.push(deadzone(dzBounds.x, dzBounds.y, dzBounds.width, dzBounds.height))

  // All obstacles + canvas
  const bounds = ShadowGenerator.Rect(0, 0, canvas.width, canvas.height, false)
  const shadowGenerator = new ShadowGenerator(obstacles, bounds, context)

  return {
    obstacles,
    monsters,
    powerups,
    player,
    objective,
    end,
    totalPowerups,
    shadowGenerator,
    collectedPowerups: 0,
  }
}

map.levels = levels // yolo
export default map
