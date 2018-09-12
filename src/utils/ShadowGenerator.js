export default class ShadowGenerator {
  constructor(rects, bounds, context) {
    this.rects = rects
    this.bounds = bounds
    this.context = context
  }

  getRectsInBounds(px, py, vision) {
    // Create vision bounds
    this.bounds = {
      x: px - (vision/2),
      y: py - (vision/2),
      width: vision,
      height: vision,
    }

    // Filter list of all relevant obstacles
    const shadowObjects = this.rects.reduce((acc, rect) => {
      if (rect.inBounds(this.bounds)) {
        acc.push(ShadowGenerator.Rect(rect.x, rect.y, rect.width, rect.height, rect))
      }
      return acc
    }, [])

    // Add vision bounds to list
    shadowObjects.push(
      ShadowGenerator.Rect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height)
    )
    return shadowObjects
  }

  getVisibilityPolygons(px, py, vision) {
    const rects = this.getRectsInBounds(px, py, vision)
    const segments = [].concat(...rects.map(r => r.segments))
    const polys = [
      [px + 10, py],
      [px - 10, py],
      [px, py + 10],
      [px, py - 10],
      [px, py],
    ].map(origin => this.getVisibilityPolygon(rects, segments, origin[0], origin[1]))

    return {
      polys,
      drawShadow: () => {
        this.context.save()

        // Darken canvas
        this.context.globalCompositeOperation = 'source-over'
        this.context.fillStyle = 'rgba(0,0,0,0.8)'
        this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height)

        //  Create clipping path
        this.context.beginPath()
        this.context.arc(px, py, vision/2, 0 , 2 * Math.PI)
        this.context.closePath()
        this.context.clip()


        // Add Vision Gradiant
        const radial = vision / 3
        const gradient = this.context.createRadialGradient(px, py, radial, px, py, vision/2)
        gradient.addColorStop(0, 'rgba(0,0,0,0.4)')
        gradient.addColorStop(1, 'rgba(0,0,0,0)')
        this.context.globalCompositeOperation = 'destination-out'
        this.context.fillStyle = gradient
        this.context.arc(px, py, vision/2, 0 , 2 * Math.PI)
        this.context.fill()

        // Clip visibility polygons
        polys.forEach(poly => this.drawPolygon(poly))

        this.context.globalCompositeOperation = 'source-over'
        const gradient2 = this.context.createRadialGradient(px, py, radial, px, py, vision/2)
        gradient2.addColorStop(1, 'rgba(0,0,0,0.4)')
        gradient2.addColorStop(0, 'rgba(0,0,0,0)')
        this.context.fillStyle = gradient2
        this.context.arc(px, py, vision/2, 0 , 2 * Math.PI)
        this.context.fill()

        // Draw bounds rects
        this.context.globalCompositeOperation = 'source-over'
        rects.forEach(r => r.rect && r.rect.draw(true, false))

        this.context.restore()
      },
    }
  }

  getAngles(rects, px, py) {
    const angleMap = {}
    const angles = []
    rects.forEach(rect => {
      rect.corners.forEach(corner => {
        const a = this.angle(corner[0], corner[1], px, py)
        if (!angleMap[a]) {
          angleMap[a] = true
          angles.push(a - 0.00001, a, a + 0.00001)
        }
      })
    })
    return angles
  }

  getClosestIntersections(segments, angles, px, py) {
    const start = [px, py]
    return angles.reduce((list, angle) => {
      const ray = [
        start,
        [px + Math.cos(angle), py + Math.sin(angle)],
      ]

      const closestIntersect = segments.reduce((closest, segment) => {
        const intersect = this.getIntersection(ray, segment)
        const useIntersect = intersect && (!closest || closest.param > intersect.param)
        return useIntersect ? intersect : closest
      }, null)

      if (closestIntersect) {
        closestIntersect.angle = angle
        list.push(closestIntersect)
      }
      return list
    }, []).sort((a, b) => a.angle - b.angle)
  }

  getVisibilityPolygon(rects, segments, px, py) {
    const angles = this.getAngles(rects, px, py)
    return this.getClosestIntersections(segments, angles, px, py)
  }
  // Ray cast, thanks to: https://ncase.me/sight-and-light/
  getIntersection(r, s) {
    // RAY in parametric: Point + Delta*T1
    const r_px = r[0][0]
    const r_py = r[0][1]
    const r_dx = r[1][0] - r_px
    const r_dy = r[1][1] - r_py
    // SEGMENT in parametric: Point + Delta*T2
    const s_px = s[0][0]
    const s_py = s[0][1]
    const s_dx = s[1][0] - s_px
    const s_dy = s[1][1] - s_py
    // Are they parallel? If so, no intersect
    const r_mag = Math.sqrt(r_dx * r_dx + r_dy * r_dy)
    const s_mag = Math.sqrt(s_dx * s_dx + s_dy * s_dy)
    if(r_dx / r_mag == s_dx / s_mag && r_dy / r_mag == s_dy / s_mag){
      // Unit vectors are the same.
      return null
    }
    const T2 = (r_dx * (s_py-r_py)  +  r_dy * (r_px-s_px)) / (s_dx * r_dy - s_dy * r_dx)
    const T1 = (s_px + s_dx * T2 - r_px) / r_dx
    // Must be within parametic whatevers for RAY/SEGMENT
    if(T1 < 0) return null
    if(T2 < 0 || T2 > 1) return null
    // Return the POINT OF INTERSECTION
    return {
      point: [r_px + r_dx * T1, r_py + r_dy * T1],
      param: T1
    }
  }

  // Angle (in radians) between two points
  angle(ax, ay, bx, by) {
    return Math.atan2(ay - by, ax - bx)
  }

  drawPolygon(poly) {
    this.context.beginPath()
    this.context.strokeStyle = 'white'
    this.context.fillStyle = 'rgba(0, 0, 0, 0.8)'
    this.context.moveTo(...poly[0].point)
    poly.forEach((p, i) => i && this.context.lineTo(...p.point))
    this.context.closePath()
    this.context.fill()
  }

  static Rect(x, y, w, h, rect) {
    const corners = [
        [x, y],
        [x + w, y],
        [x + w, y + h],
        [x, y + h],
      ]
    return {
      shape: [x, y, w, h],
      corners,
      segments: corners.map((c, i, l) => ([c, l[i + 1] || l[0]])),
      rect,
    }
  }
}
