import controls from './controls'
import map from './map'
import audio from './audio'
import gameObjects from './gameObjects'

const [canvas] = document.getElementsByTagName('canvas')
const context = canvas.getContext('2d')
const width = canvas.width
const height = canvas.height

// Level Generation, get all objects that will be in the game
const { obstacles, monsters, powerps, player, end } = map(canvas, context)

function loop() {
  // Clear drawing
  context.clearRect(0, 0, canvas.width, canvas.height)

  // Draw background
  context.globalAlpha = 1
  context.fillStyle = `#121212`
  context.fillRect(0, 0, canvas.width, canvas.height)

  // Update player from controls
  if (controls.jump && (!player.jump && player.grnd)) {
    player.jump = true
    player.grnd = false
    player.v.y = -player.speed * 2.5 // jump height
    audio.jump()
  }
  if (controls.right && (player.v.x < player.speed)) player.v.x++
  if (controls.left && (player.v.x > -player.speed)) player.v.x--

  // Apply environment settings
  player.v.x *= 0.8 // friction
  player.v.y += 0.25 // gravity
  player.grnd = false

  // Check for a collision with an obstacle
  obstacles.forEach(obstacle => {
    const [direction, adjustment] = obstacle.collides(player)
    if (direction === 'left' || direction === 'right') {
      player.v.x = 0
      player.jump = false
      player.x += adjustment
    } else if (direction === 'bottom') {
      player.grnd = true
      player.jump = false
      player.y += adjustment
    } else if (direction === 'top') {
      player.v.y *= -1
      player.y += adjustment
    }
    obstacle.draw()
  })

  // Apply player v to position
  if (player.grnd) player.v.y = 0
  player.x += player.v.x
  player.y += player.v.y
  player.draw()


  // TODO: Test for collision with enemies and kill player
  // TODO: Test for collision outside of canvas, and kill player
  // TODO: Test for collision with battery-packs and reset lighting

  requestAnimationFrame(loop)
}

// Invoke
loop()
