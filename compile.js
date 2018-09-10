const fs = require('fs')
const path = require('path')
const { pd } = require('pretty-data')

const html = fs.readFileSync('dist/index.html', 'utf8')
const htmlLines = html.split('\n')

const newHtml = htmlLines.map(line => {
  // If line needs to be replaced
  if (line.includes('<!--%')) {
    const file = `dist/${line.split('%')[1]}`
    const { ext } = path.parse(file)
    switch (ext) {
      case '.js':
        return `<script>${fs.readFileSync(file, 'utf8')}</script>`
      break
      case '.css':
        return `<style>${pd.cssmin(fs.readFileSync(file, 'utf8'))}</style>`
      break
      case '.svg':
        return `<img src="data:image/svg+xml;utf8,${fs.readFileSync(file, 'utf8').split('"').join( "'")}" />`
      break
    }
  }
  return line
})

fs.writeFileSync('game/index.html', pd.xmlmin(newHtml.join('')))
