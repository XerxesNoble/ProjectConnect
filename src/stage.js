export default function initStage(selector, callback) {
  const stageParent = document.querySelector(selector);
  if(!stageParent) throw(new Error(`Selector ${selector} doesn't return an element.`))

  const bbox = stageParent.getBoundingClientRect()

  // Set width and height here
  const canvas = getCanvas(bbox.width, bbox.height)
  // Add dynamicly sized canvas to dom
  stageParent.appendChild(canvas)

  callback(canvas)
}

function getCanvas(w, h){
  const c = document.createElement('canvas')
  c.setAttribute('width', w)
  c.setAttribute('height', h)
  return c
}
