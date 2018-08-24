/*
  Making sounds with: https://xem.github.io/miniMusic/simple.html
*/
export default {
  play(data) {
    const audioCtx = new AudioContext()
    const gainNode = audioCtx.createGain()
    for (let i in data) {
      const oscillator = audioCtx.createOscillator()
      if (data[i]) {
        oscillator.connect(gainNode)
        gainNode.connect(audioCtx.destination)
        oscillator.start(i * 0.1)
        oscillator.frequency.setValueAtTime(440 * 1.06 ** (13 - data[i]), i * 0.1)
        oscillator.type='triangle'
        gainNode.gain.setValueAtTime(1, i * 0.1)
        gainNode.gain.setTargetAtTime(0.0001, i * 0.1 + 0.08, 0.005)
        oscillator.stop(i * 0.1 + 0.09)
      }
    }
  },
  jump() {
    this.play([25,20,15])
  }
}
