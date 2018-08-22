const [canvas] = document.getElementByTagName('canvas')
const context = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

const controls = getControls()

const player = {
  x: width / 2,
  y: height / 2,
  width: 25,
  height: 25,
  speed: 3,
  velocity: { x: 0, y: 0 },
  isJumping: false,
  onGround: false,
  draw() {
    context.fillStyle = 'lightgreen'
    context.rect(this.x, this.y, this.width, this.height)
  }
}


function draw() {
  context.clearRect(0, 0, width, height)
  context.beginPath()
  obstacles.forEach(o => o.draw())
  player.draw()
}


function update() {
    // Update player from controls
    if (controls.jump && !player.isJumping && player.onGround) {
        player.isJumping = true
        player.velocity.y = -player.speed * 2.5 // jump height
    }
    if (controls.right && player.velocity.x < player.speed) player.velocity.x++
    if (controls.left && player.velocity.x > -player.speed) player.velocity.x--

    // Apply environment settings
    player.velocity.x *= 0.8 // friction
    player.velocity.y += 0.4 // gravity
    player.onGround = false

    // Check for a collision with an obstacle
    const collision = obstacles.forEach(o => o.collides(player))
    if (collision === 'left' || collision === 'right') {
        player.velocity.x = 0
        player.isJumping = false
    } else if (collision === 'bottom') {
        player.onGround = true
        player.isJumping = false
    } else if (collision === 'top') {
        player.velocity.y *= -1
    }

    // Apply player velocity to position
    if (player.onGround) player.velocity.y = 0
    player.x += player.velocity.x
    player.y += player.velocity.y

    // TODO: Test for collision with enemies and kill player
    // TODO: Test for collision with battery-packs and reset lighting
}

function obstacle(x, y, width, height, color) {
  return {
    x, y, width, height, color,
    collides(player) {
      return checkCollision(this, player)
    }
    draw() {
      context.fillStyle = color
      context.rect(x, y, width, height)
    }
  }

function getControls() {
  const keys = { jump: [38, 32, 87], right: [39, 68], left: [37, 65] }
  const controls = { jump: false, right: false, left: false }
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
  // If there is a collision, return the side the collision happened
  if (!(
        ((a.y + a.height) < (b.y)) ||
        (a.y > (b.y + b.height)) ||
        ((a.x + a.width) < b.x) ||
        (a.x > (b.x + b.width))
    )) {
     const bottom = (b.y + b.height) - a.y
     const top = (a.y + a.height) - b.y
     const left = (a.x + a.width) - b.x
     const right = (b.x + b.width) - a.x

     if (top < bottom && top < left && top < right ) return 'top'
     if (bottom < top && bottom < left && bottom < right) return 'bottom'
     if (left < right && left < top && left < bottom) return 'left'
     if (right < left && right < top && right < bottom ) return 'right'
     if (left === right || top === bottom) return 'inside'
  }
  return false
}




    // //draw powerup stuff
    // for(var j = 0; j < powerup.length; j++){
    //   context.save();
    //   var cx = powerup[j].x + 0.5 * powerup[j].width,   // x of shape center
    //   cy = powerup[j].y + 0.5 * powerup[j].height; //y of shape center
    //   context.translate(cx, cy);  //translate to center of shape
    //   context.rotate( (Math.PI / 180) * 45);//rotate 25 degrees.
    //   if(powerup[j].effect  === 'tele'){
    //     context.rotate( (Math.PI / 180) * powerup[j].rotate);//rotate 25 degrees.
    //     powerup[j].rotate = (Math.PI / 180) * powerup[j].rotate;
    //   }
    //   context.translate(-cx, -cy);            //translate center back to 0,0
    //   context.fillStyle = powerup[j].color;
    //   context.fillRect(powerup[j].x, powerup[j].y, powerup[j].width, powerup[j].height);
    //   context.restore();
    //
    //   // //powerup collision
    //   // if(colCheck(player, powerup[j])!==null){//touched power up!
    //   //   if(powerup[j].effect==='gravity'){
    //   //     gravity= 0.4;//decrease gravity
    //   //     player.speed = 4;
    //   //     player.color = 'white';
    //   //   }
    //   //   else if (powerup[j].effect==='shrink'){
    //   //     player.width= 10;
    //   //     player.height= 10;
    //   //     player.speed = 5;
    //   //   }
    //   //   else if (powerup[j].effect==='tele'){
    //   //     player.x=powerup[j].px;
    //   //     player.y=powerup[j].py;
    //   //   }
    //   //   else if (powerup[j].effect==='win'){
    //   //     var r = confirm("You win! Play again?");
    //   //     if (r == false) {
    //   //          player.x=200;
    //   //          player.y=200;
    //   //     } else {
    //   //          window.location.href = window.location.href;
    //   //     }
    //   //   }
    //   //   if(powerup[j].stay!==true)
    //   //   powerup[j].width=0;//make power up go away
    //   // }


window.addEventListener("load", function () {
    update();
});
