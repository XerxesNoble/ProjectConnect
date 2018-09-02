/*
  Making sounds with: https://xem.github.io/miniMusic/simple.html
*/
export default {
  play(data, tempo = 0.1) {
    const audioCtx = new AudioContext()
    const gainNode = audioCtx.createGain()
    for (let i in data) {
      const oscillator = audioCtx.createOscillator()
      if (data[i]) {
        oscillator.connect(gainNode)
        gainNode.connect(audioCtx.destination)
        oscillator.start(i * tempo)
        oscillator.frequency.setValueAtTime(440 * 1.06 ** (13 - data[i]), i * tempo)
        oscillator.type='triangle'
        gainNode.gain.setValueAtTime(1, i * tempo)
        gainNode.gain.setTargetAtTime(0.0001, i * tempo + 0.08, 0.005)
        oscillator.stop(i * tempo + 0.09)
      }
    }
  },
  jump() {
    this.play([25])
  },
  win() {
    this.play([25,20,15])
  },
  powerup() {
    this.play([13,12,11,10], 0.08)
  },
  die() {
    this.play([13,14,15,,16,17,18,,19,20,21], 0.2)
  }
}
