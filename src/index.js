const [canvas] = document.getElementsByTagName('canvas')
const context = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

const controls = getControls()
const player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  width: 25,
  height: 25,
  speed: 3,
  velocity: {
    x: 0,
    y: 0
  },
  isJumping: false,
  onGround: false,
  draw() {
    context.fillStyle = 'lightgreen'
    context.fillRect(this.x, this.y, this.width, this.height)
  }
}
const obstacles = [
  obstacle(0, window.innerHeight - 20, window.innerWidth, 20, '#212121'),
  obstacle(window.innerWidth / 3, window.innerHeight - 130, window.innerWidth, 20, '#212121'),
  obstacle(window.innerWidth / 4, window.innerHeight - 90, window.innerWidth, 20, '#212121'),
]

function loop() {
  // Clear drawing
  context.clearRect(0, 0, canvas.width, canvas.height)

  // Draw background
  context.globalAlpha = 1
  context.fillStyle = `#121212`
  context.fillRect(0, 0, canvas.width, canvas.height)

  // Update player from controls
  if (controls.jump && (!player.isJumping && player.onGround)) {
    player.isJumping = true
    player.onGround = false
    player.velocity.y = -player.speed * 2.5 // jump height
  }
  if (controls.right && (player.velocity.x < player.speed)) player.velocity.x++
  if (controls.left && (player.velocity.x > -player.speed)) player.velocity.x--

  // Apply environment settings
  player.velocity.x *= 0.8 // friction
  player.velocity.y += 0.3 // gravity
  player.onGround = false

  // Check for a collision with an obstacle
  obstacles.forEach(obstacle => {
    const [direction, adjustment] = obstacle.collides(player)
    if (direction === 'left' || direction === 'right') {
      player.velocity.x = 0
      player.isJumping = false
      player.x += adjustment
    } else if (direction === 'bottom') {
      player.onGround = true
      player.isJumping = false
      player.y += adjustment
    } else if (direction === 'top') {
      player.velocity.y *= -1
      player.y += adjustment
    }
    obstacle.draw()
  })




  // Apply player velocity to position
  if (player.onGround) player.velocity.y = 0
  player.x += player.velocity.x
  player.y += player.velocity.y
  player.draw()


  // TODO: Test for collision with enemies and kill player
  // TODO: Test for collision with battery-packs and reset lighting

  requestAnimationFrame(loop)
}

function obstacle(x, y, width, height, color) {
  return {
    x,
    y,
    width,
    height,
    color,
    collides(player) {
      return checkCollision(player, this)
    },
    draw() {
      context.fillStyle = color
      context.fillRect(x, y, width, height)
    }
  }
}

function getControls() {
  const keys = {
    jump: [38, 32, 87],
    right: [39, 68],
    left: [37, 65]
  }
  const controls = {
    jump: false,
    right: false,
    left: false
  }
  const setControl = flag => {
    Object.keys(controls).forEach(control => {
      if (keys[control].indexOf(event.keyCode) > -1) controls[control] = flag
    })
  }
  document.body.addEventListener('keydown', event => setControl(true))
  document.body.addEventListener('keyup', event => setControl(false))
  return controls
}

function checkCollision(a, b) {
  const vec = [
    (a.x + (a.width / 2)) - (b.x + (b.width / 2)),
    (a.y + (a.height / 2)) - (b.y + (b.height / 2)),
  ]
  const overlap = [
    (a.width / 2) + (b.width / 2),
    (a.height / 2) + (b.height / 2),
  ]

  if (Math.abs(vec[0]) < overlap[0] && Math.abs(vec[1]) < overlap[1]) {
    const oDiff = [
      overlap[0] - Math.abs(vec[0]),
      overlap[1] - Math.abs(vec[1]),
    ]
    if (oDiff[0] >= oDiff[1]) {
      if (vec[1] > 0) return ['top', oDiff[1]]
      else return ['bottom', -oDiff[1]]
    } else {
      if (vec[0] > 0) return ['left', oDiff[0]]
      else return ['right', -oDiff[0]]
    }
  }
  return [null, null]
}


// Invoke
loop()
