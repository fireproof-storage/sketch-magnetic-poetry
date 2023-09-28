const words = {
  the: 100, and: 100, you: 85, are: 85, is: 80, was: 80, of: 75, from: 75,
  a: 70, an: 70, I: 65, we: 65, in: 60, out: 60, to: 55, because: 22, although: 12,
  however: 12, therefore: 12, moreover: 12, furthermore: 12, nonetheless: 12,
  consequently: 12, hence: 12, thus: 12, otherwise: 12, meanwhile: 12, likewise: 12,
  similarly: 12, conversely: 12, instead: 12, nevertheless: 12, accordingly: 12,
  subsequently: 12, incidentally: 12, henceforth: 12, for: 55, me: 50, us: 50, with: 50,
  but: 50, so: 50, run: 50, see: 45, hear: 40, speak: 40, feel: 35, touch: 35, think: 30,
  know: 30, understand: 25, learn: 25, remember: 20, forget: 20, live: 5, die: 5, walk: 50,
  jump: 45, talk: 45, listen: 40, write: 40, read: 35, sing: 35, dance: 30, eat: 20,
  drink: 15, sleep: 15, wake: 10, sit: 10, stand: 5, lie: 5, love: 35, hate: 35, heart: 30,
  mind: 30, night: 25, day: 25, moon: 20, sun: 20, stars: 18, planets: 18, rain: 16,
  ocean: 14, sea: 14, wind: 12, breeze: 12, kiss: 10, hug: 10, embrace: 8, hold: 8,
  dream: 7, nightmare: 7, laugh: 6, cry: 6, tears: 5, smiles: 5, whisper: 4, shout: 4,
  gaze: 4, glance: 4, smile: 4, frown: 4, passion: 3, indifference: 3, soul: 3, body: 3,
  desire: 3, aversion: 3, forever: 3, never: 3, eternity: 2, moment: 2, serenade: 2,
  silence: 2, sunset: 2, sunrise: 2, beauty: 2, ugliness: 2, melody: 2, discord: 2,
  silhouette: 2, shadow: 2, fire: 2, ice: 2, gentle: 5, rough: 5, warmth: 5, cold: 5,
  mystery: 5, clarity: 5, whispers: 5, screams: 5, romance: 5, breakup: 5, tenderness: 5,
  harshness: 5, crimson: 5, azure: 5, magic: 5, reality: 5, enchanted: 5, disenchanted: 5,
  kisses: 5, slaps: 5, passionate: 5, apathetic: 5, intoxicate: 5, sober: 5, heartbeat: 5,
  breath: 5, dreams: 5, awake: 5, twilight: 5, dawn: 5, eclipse: 5, fullmoon: 2, stardust: 2,
  earthdust: 2, universe: 2, world: 2, velvet: 2, silk: 2, infinite: 2, finite: 2, captivate: 2,
  repel: 2, adoration: 2, contempt: 2, sigh: 2, gasp: 2, moonlight: 2, sunlight: 2, gentleness: 2,
  severity: 2, comet: 2, nebula: 2, galaxy: 2, meteor: 2, quasar: 2, supernova: 2, blackhole: 2,
  wormhole: 2, starcluster: 2, pulsar: 2, constellation: 2, zodiac: 2, aries: 2, taurus: 2,
  gemini: 2, cancer: 2, leo: 2, virgo: 2, libra: 2, scorpio: 2, sagittarius: 2, capricorn: 2,
  aquarius: 2, pisces: 2, whispering: 2, yelling: 2, romantic: 2, platonic: 2, crush: 2,
  dislike: 2, tender: 2, tough: 2, affection: 2, disgust: 2, passionately: 2, calmly: 2,
  embracing: 2, pushing: 2, cuddle: 2, distance: 2, enchantment: 2, disillusionment: 2,
  mysterious: 2, obvious: 2, tryst: 2, separation: 2, devotion: 2, neglect: 2, yearning: 2,
  satisfaction: 2, firelight: 1, darkness: 1, whispered: 1, spoken: 1, moonbeam: 1, sunbeam: 1,
  caress: 1, scratch: 1
}

const wordBag = []

for (const word in words) {
  // @ts-ignore
  for (let i = 0; i < words[word]; i++) {
    wordBag.push(word)
  }
}

const randomWords = wordBag.sort(() => 0.5 - Math.random())

export { words, randomWords }
