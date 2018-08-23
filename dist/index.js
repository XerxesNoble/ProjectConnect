const [canvas] = document.getElementsByTagName('canvas')
const context = canvas.getContext('2d')
const width = canvas.width
const height = canvas.height


/*
  TODO: Maybe make this generative?
*/
const map = [
  '                  #                       %            $',
  ' ***  ** ***  ** ***  ** ***  ** ***  ** ***  ** ***  **',
  '                      %             %                   ',
  '** ******  **** **  ****** ******  ******* ******* *****',
  '    #         %                                         ',
  '** ***  ** ******* ******* ***  * ***     ** ***   *****',
  '                        %              #         %      ',
  '***** *  *** ******* ******* **  *** *******  ******* **',
]


/*
  Level Generation.
*/
const obstacles = []
const size = Math.floor(height / map.length)
map.forEach((row, i) => {
  const y = i * size
  row.split('').forEach((block, j) => {
    const x = j * size
    console.log(x, y)
    switch (block) {
      case '*':
        obstacles.push(obstacle(x, y, size, 25))
      case '%':
        // TODO: Monster
      case '#':
        // TODO: Powerup
      case '$':
        // TODO: End goal
      default:
        void 0
    }
  })
})



const controls = getControls()
const player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
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
    if (this.jump) context.fillStyle = 'orange'
    if (controls.right) context.fillStyle = 'red'
    if (controls.left) context.fillStyle = 'lightgreen'
    context.fillRect(this.x, this.y, this.width, this.height)
  }
}

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
  }
  if (controls.right && (player.v.x < player.speed)) player.v.x++
  if (controls.left && (player.v.x > -player.speed)) player.v.x--

  // Apply environment settings
  player.v.x *= 0.8 // friction
  player.v.y += 0.3 // gravity
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

function obstacle(x, y, width, height) {
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
