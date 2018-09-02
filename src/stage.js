export default function initStage(selector, callback) {
  const stageParent = document.querySelector(selector);
  if(!stageParent) throw(new Error(`Selector ${selector} doesn't return an element.`))

  const bbox = stageParent.getBoundingClientRect()

  // Set width and height here & return context
  const context = getContext(bbox.width, bbox.height)

  // Add dynamicly sized canvas to dom
  stageParent.appendChild(context.canvas)

  return context
}

function getContext(w, h){
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  const dpr = global.devicePixelRatio || 1
  canvas.width = w * dpr
  canvas.height = h * dpr
  canvas.style.width = `${w}px`
  canvas.style.height = `${h}px`
  context._spriteSize = Math.ceil(canvas.height * 0.023)
  context.dpr = dpr
  return context
}
