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
  const setControl = (keyCode, flag) => {
    Object.keys(controls).forEach(control => {
      if (keys[control].indexOf(keyCode) > -1) controls[control] = flag
    })
  }
  document.body.addEventListener('keydown', event => setControl(event.keyCode, true))
  document.body.addEventListener('keyup', event => setControl(event.keyCode, false))
  return controls
}

export default getControls()
