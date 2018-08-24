export function checkCollision(a, b) {
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
